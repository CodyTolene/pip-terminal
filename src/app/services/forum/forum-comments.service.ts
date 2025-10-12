import { Observable, defer, map } from 'rxjs';
import { ForumComment, ForumCommentCreate } from 'src/app/models';

import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
} from '@angular/fire/firestore';

@Injectable()
export class ForumCommentsService {
  private readonly firestore = inject(Firestore);
  private readonly env = inject(EnvironmentInjector);

  private inCtx<T>(fn: () => Promise<T>): Promise<T> {
    return runInInjectionContext(this.env, fn);
  }

  private inCtx$<T>(factory: () => Observable<T>): Observable<T> {
    return defer(() => runInInjectionContext(this.env, factory));
  }

  public async addComment(comment: ForumCommentCreate): Promise<void> {
    return this.inCtx(async () => {
      const commentsRef = collection(
        this.firestore,
        `forum/${comment.postId}/comments`,
      );
      try {
        await addDoc(commentsRef, ForumComment.serialize(comment));
      } catch {
        throw new Error('Failed to add comment');
      }
    });
  }

  public getComments(postId: string): Observable<readonly ForumComment[]> {
    return this.inCtx$(() => {
      const commentsRef = collection(
        this.firestore,
        `forum/${postId}/comments`,
      );
      const qRef = query(commentsRef, orderBy('createdAt', 'asc'));
      return collectionData(qRef, { idField: 'id' }).pipe(
        map(ForumComment.deserializeList),
      );
    });
  }
}
