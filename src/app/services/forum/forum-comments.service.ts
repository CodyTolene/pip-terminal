import { TableSortChangeEvent } from '@proangular/pro-table';
import { Observable, defer, map } from 'rxjs';
import { ForumComment, ForumCommentCreate } from 'src/app/models';

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
  documentId,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  startAfter,
} from '@angular/fire/firestore';

import { ForumCommentPageArgs } from 'src/app/types/forum-comment-page-args';
import { ForumCommentPagedResult } from 'src/app/types/forum-comment-paged-result';

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

  public async addComment(input: ForumCommentCreate): Promise<void> {
    return this.inCtx(async () => {
      const commentsRef = collection(
        this.firestore,
        `forum/${input.postId}/comments`,
      );
      await addDoc(commentsRef, ForumComment.serialize(input));
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

  public async getCommentsPage(
    postId: string,
    { pageSize = 10, lastDoc, firstDoc, sort }: ForumCommentPageArgs = {
      pageSize: 10,
    },
  ): Promise<ForumCommentPagedResult> {
    return this.inCtx(async () => {
      const commentsRef = collection(
        this.firestore,
        `forum/${postId}/comments`,
      );
      const n = pageSize + 1;

      const key = sort?.key ?? 'createdAt';
      const dir: TableSortChangeEvent<ForumComment>['direction'] =
        sort?.direction || 'desc';

      // Stable sort: primary key then doc id
      const base = [orderBy(key, dir), orderBy(documentId(), dir)] as const;

      let qRef;
      if (firstDoc) {
        // Previous page
        qRef = query(commentsRef, ...base, endBefore(firstDoc), limitToLast(n));
      } else if (lastDoc) {
        // Next page
        qRef = query(commentsRef, ...base, startAfter(lastDoc), limit(n));
      } else {
        // First page
        qRef = query(commentsRef, ...base, limit(n));
      }

      const snap = await getDocs(qRef);

      let hasMoreNext = false;
      let hasMorePrev = false;
      let keptDocs: ReadonlyArray<QueryDocumentSnapshot<DocumentData>>;

      if (firstDoc) {
        // When paging backward an extra doc means there is another previous page
        hasMorePrev = snap.size > pageSize;
        keptDocs = snap.docs.slice(Math.max(0, snap.docs.length - pageSize));
        // If we had a previous cursor, by definition there is a forward page
        hasMoreNext = true;
      } else {
        // When paging forward or first load an extra doc means another next page
        hasMoreNext = snap.size > pageSize;
        keptDocs = snap.docs.slice(0, pageSize);
        // If we supplied a forward cursor, there is a previous page
        hasMorePrev = !!lastDoc;
      }

      const comments = keptDocs.map((d) =>
        ForumComment.deserialize({ id: d.id, ...(d.data() as object) }),
      );

      return {
        hasMoreNext,
        hasMorePrev,
        comments,
        firstDoc: keptDocs[0] ?? undefined,
        lastDoc: keptDocs[keptDocs.length - 1] ?? undefined,
      };
    });
  }

  public async getLastCommentsPage(
    postId: string,
    {
      pageSize = 10,
      sort,
    }: { pageSize?: number; sort?: TableSortChangeEvent<ForumComment> } = {},
  ): Promise<ForumCommentPagedResult> {
    return this.inCtx(async () => {
      const commentsRef = collection(
        this.firestore,
        `forum/${postId}/comments`,
      );
      const n = pageSize + 1;

      const key = sort?.key ?? 'createdAt';
      const dir: TableSortChangeEvent<ForumComment>['direction'] =
        sort?.direction || 'desc';

      const qRef = query(
        commentsRef,
        orderBy(key, dir),
        orderBy(documentId(), dir),
        limitToLast(n),
      );

      const snap = await getDocs(qRef);
      const keptDocs = snap.docs.slice(
        Math.max(0, snap.docs.length - pageSize),
      );

      const comments = keptDocs.map((d) =>
        ForumComment.deserialize({ id: d.id, ...(d.data() as object) }),
      );

      return {
        hasMoreNext: false,
        hasMorePrev: snap.size > pageSize,
        comments,
        firstDoc: keptDocs[0] ?? undefined,
        lastDoc: keptDocs[keptDocs.length - 1] ?? undefined,
      };
    });
  }

  public async getCommentsTotal(postId: string): Promise<number> {
    return this.inCtx(async () => {
      const commentsRef = collection(
        this.firestore,
        `forum/${postId}/comments`,
      );
      const agg = await getCountFromServer(query(commentsRef));
      return agg.data().count ?? 0;
    });
  }
}
