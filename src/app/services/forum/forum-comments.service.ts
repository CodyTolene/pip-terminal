import { TableSortChangeEvent } from '@proangular/pro-table';
import { DateTime } from 'luxon';
import { Observable, defer } from 'rxjs';
import { ForumComment, ForumCommentCreate } from 'src/app/models';

import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import {
  DocumentData,
  Firestore,
  QueryDocumentSnapshot,
  addDoc,
  collection,
  deleteDoc,
  doc,
  documentId,
  endBefore,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
} from '@angular/fire/firestore';

import { FlagResult } from 'src/app/types/flag-result';
import { ForumCommentPageArgs } from 'src/app/types/forum-comment-page-args';
import { ForumCommentPagedResult } from 'src/app/types/forum-comment-paged-result';
import { LikeResult } from 'src/app/types/like-result';
import { UnflagResult } from 'src/app/types/unflag-result';
import { UnlikeResult } from 'src/app/types/unlike-result';

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

  public async addComment(
    input: ForumCommentCreate,
  ): Promise<ForumComment | null> {
    return this.inCtx(async () => {
      try {
        const commentsRef = collection(
          this.firestore,
          `forum/${input.postId}/comments`,
        );
        const serialized = ForumComment.serialize(input);
        const newDoc = await addDoc(commentsRef, serialized);
        const deserialized = ForumComment.deserialize({
          id: newDoc.id,
          ...serialized,
          createdAt: {
            seconds: DateTime.now().toSeconds(),
            nanoseconds: 0,
          },
        });
        return deserialized;
      } catch (e) {
        console.error('Failed to add comment', e);
        return null;
      }
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

  public async flagComment(
    postId: string,
    commentId: string,
    uid: string,
    reason?: string,
  ): Promise<FlagResult> {
    return this.inCtx(async () => {
      const flagRef = doc(
        this.firestore,
        `forum/${postId}/comments/${commentId}/flags/${uid}`,
      );
      try {
        await setDoc(flagRef, {
          createdAt: serverTimestamp(),
          ...(reason ? { reason } : {}),
        });
        return { ok: true as const };
      } catch (e) {
        const err = e as FirebaseError;
        if (err.code === 'permission-denied') {
          return { ok: false as const, reason: 'already-flagged' as const };
        }
        if (err.code === 'unauthenticated') {
          return { ok: false as const, reason: 'needs-auth' as const };
        }
        return { ok: false as const, reason: 'unknown' as const };
      }
    });
  }

  public async unflagComment(
    postId: string,
    commentId: string,
    uid: string,
  ): Promise<UnflagResult> {
    return this.inCtx(async () => {
      const flagRef = doc(
        this.firestore,
        `forum/${postId}/comments/${commentId}/flags/${uid}`,
      );
      try {
        await deleteDoc(flagRef);
        return { ok: true as const };
      } catch (e) {
        const err = e as FirebaseError;
        if (err.code === 'unauthenticated') {
          return {
            ok: false as const,
            reason: 'needs-auth',
            message: err.message,
          };
        }
        if (err.code === 'permission-denied') {
          return {
            ok: false as const,
            reason: 'not-owner',
            message: err.message,
          };
        }
        if (err.code === 'deadline-exceeded' || err.code === 'unavailable') {
          return {
            ok: false as const,
            reason: 'retry-later',
            message: err.message,
          };
        }
        return { ok: false as const, reason: 'unknown', message: err.message };
      }
    });
  }

  public async likeComment(
    postId: string,
    commentId: string,
    uid: string,
  ): Promise<LikeResult> {
    return this.inCtx(async () => {
      const likeRef = doc(
        this.firestore,
        `forum/${postId}/comments/${commentId}/likes/${uid}`,
      );
      try {
        await setDoc(likeRef, { createdAt: serverTimestamp() });
        return { ok: true as const };
      } catch (e) {
        const err = e as FirebaseError;
        if (err.code === 'permission-denied') {
          return { ok: false as const, reason: 'already-liked' as const };
        }
        if (err.code === 'unauthenticated') {
          return { ok: false as const, reason: 'needs-auth' as const };
        }
        return { ok: false as const, reason: 'unknown' as const };
      }
    });
  }

  public async unlikeComment(
    postId: string,
    commentId: string,
    uid: string,
  ): Promise<UnlikeResult> {
    return this.inCtx(async () => {
      const likeRef = doc(
        this.firestore,
        `forum/${postId}/comments/${commentId}/likes/${uid}`,
      );
      try {
        await deleteDoc(likeRef);
        return { ok: true as const };
      } catch (e) {
        const err = e as FirebaseError;
        if (err.code === 'permission-denied') {
          return {
            ok: false as const,
            reason: 'not-owner',
            message: err.message,
          };
        }
        if (err.code === 'deadline-exceeded' || err.code === 'unavailable') {
          return {
            ok: false as const,
            reason: 'retry-later',
            message: err.message,
          };
        }
        return { ok: false as const, reason: 'unknown', message: err.message };
      }
    });
  }
}
