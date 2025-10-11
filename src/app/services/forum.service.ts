import { Observable, defer, map } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import {
  ForumComment,
  ForumCommentCreate,
  ForumPost,
  ForumPostCreate,
} from 'src/app/models';

import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  collectionData,
  doc,
  docData,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
  where,
} from '@angular/fire/firestore';

@Injectable()
export class ForumService {
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
      await addDoc(commentsRef, ForumComment.serialize(comment));
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

  public async addPost(post: ForumPostCreate): Promise<void> {
    await this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const newPost = ForumPost.serialize(post);
      await addDoc(postsRef, newPost);
    });
  }

  public getPost(postId: string): Observable<ForumPost | null> {
    return this.inCtx$(() => {
      const postRef = doc(this.firestore, `forum/${postId}`);
      return docData(postRef, { idField: 'id' }).pipe(
        map((data) => (data ? ForumPost.deserialize(data) : null)),
      );
    });
  }

  // public getAllPosts(): Observable<readonly ForumPost[]> {
  //   return this.inCtx$(() => {
  //     const postsRef = collection(this.firestore, 'forum');
  //     const qRef = query(postsRef, orderBy('createdAt', 'desc'));
  //     return collectionData(qRef, { idField: 'id' }).pipe(
  //       map(ForumPost.deserializeList),
  //     );
  //   });
  // }

  public async getPostsPage(
    { pageSize = 10, lastDoc, firstDoc, category }: PostPageArgs = {
      pageSize: 10,
    },
  ): Promise<PostPage> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const baseConstraints = [
        ...(category ? [where('category', '==', category)] : []),
        orderBy('createdAt', 'desc'),
      ] as const;

      let qRef;
      if (firstDoc) {
        // Previous
        qRef = query(
          postsRef,
          ...baseConstraints,
          endBefore(firstDoc),
          limitToLast(n),
        );
      } else if (lastDoc) {
        // Next
        qRef = query(
          postsRef,
          ...baseConstraints,
          startAfter(lastDoc),
          limit(n),
        );
      } else {
        // First page
        qRef = query(postsRef, ...baseConstraints, limit(n));
      }

      const snap = await getDocs(qRef);
      let hasMoreNext = false;
      let hasMorePrev = false;
      let keptDocs: ReadonlyArray<QueryDocumentSnapshot<DocumentData>>;

      if (firstDoc) {
        hasMorePrev = snap.size > pageSize;
        keptDocs = snap.docs.slice(Math.max(0, snap.docs.length - pageSize));
        hasMoreNext = true;
      } else {
        hasMoreNext = snap.size > pageSize;
        keptDocs = snap.docs.slice(0, pageSize);
        hasMorePrev = !!lastDoc;
      }

      const posts = keptDocs.map((d) =>
        ForumPost.deserialize({ id: d.id, ...(d.data() as object) }),
      );

      return {
        posts,
        firstDoc: keptDocs[0],
        lastDoc: keptDocs[keptDocs.length - 1],
        hasMoreNext,
        hasMorePrev,
      };
    });
  }

  public async getPostsTotal(): Promise<number> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const agg = await getCountFromServer(query(postsRef));
      return agg.data().count ?? 0;
    });
  }
}

export interface PostPage {
  /** The posts for this page. */
  posts: readonly ForumPost[];
  /** For fetching previous posts. */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** For fetching next posts. */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  hasMoreNext: boolean;
  hasMorePrev: boolean;
}

interface PostPageArgs {
  /** Number of posts to return per page. */
  pageSize?: number;
  /** Forward cursor (Next). */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Backward cursor (Previous). */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Optional category filter. */
  category?: ForumCategoryEnum;
}
