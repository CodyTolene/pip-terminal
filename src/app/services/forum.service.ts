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
  documentId,
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

  public async getPostsPage(
    { pageSize = 10, lastDoc, firstDoc, category, sort }: PostPageArgs = {
      pageSize: 10,
    },
  ): Promise<PostPage> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const field = sort?.field ?? 'createdAt';
      const dir: SortDir = sort?.direction ?? 'desc';

      const baseConstraints = [
        ...(category ? [where('category', '==', category)] : []),
        orderBy(field, dir),
        orderBy(documentId(), dir), // stable tie-breaker
      ] as const;

      let qRef;
      if (firstDoc) {
        qRef = query(
          postsRef,
          ...baseConstraints,
          endBefore(firstDoc),
          limitToLast(n),
        );
      } else if (lastDoc) {
        qRef = query(
          postsRef,
          ...baseConstraints,
          startAfter(lastDoc),
          limit(n),
        );
      } else {
        qRef = query(postsRef, ...baseConstraints, limit(n));
      }

      const snap = await getDocs(qRef);

      let keptDocs: ReadonlyArray<QueryDocumentSnapshot<DocumentData>>;
      let hasMoreNext = false;
      let hasMorePrev = false;

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

  public async getLastPostsPage({
    pageSize = 10,
    category,
    sort,
  }: {
    pageSize?: number;
    category?: ForumCategoryEnum;
    sort?: SortSpec;
  } = {}): Promise<PostPage> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const field = sort?.field ?? 'createdAt';
      const dir: SortDir = sort?.direction ?? 'desc';

      const qRef = query(
        postsRef,
        ...(category ? [where('category', '==', category)] : []),
        orderBy(field, dir),
        orderBy(documentId(), dir),
        limitToLast(n),
      );

      const snap = await getDocs(qRef);
      const keptDocs = snap.docs.slice(
        Math.max(0, snap.docs.length - pageSize),
      );
      const posts = keptDocs.map((d) =>
        ForumPost.deserialize({ id: d.id, ...(d.data() as object) }),
      );

      return {
        posts,
        firstDoc: keptDocs[0],
        lastDoc: keptDocs[keptDocs.length - 1],
        hasMoreNext: false,
        hasMorePrev: snap.size > pageSize,
      };
    });
  }

  public async getPostsTotal(args?: {
    category?: ForumCategoryEnum;
  }): Promise<number> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const constraints = [
        ...(args?.category ? [where('category', '==', args.category)] : []),
      ] as const;
      const agg = await getCountFromServer(query(postsRef, ...constraints));
      return agg.data().count ?? 0;
    });
  }
}

type SortDir = 'asc' | 'desc';

export interface SortSpec {
  field: string;
  direction: SortDir;
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
  /** Optional sort specification. */
  sort?: SortSpec;
}
