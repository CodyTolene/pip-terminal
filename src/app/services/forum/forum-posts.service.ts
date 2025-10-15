import { TableSortChangeEvent } from '@proangular/pro-table';
import { DateTime } from 'luxon';
import { Observable, defer, map } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost, ForumPostCreate } from 'src/app/models';

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
  docData,
  documentId,
  endBefore,
  getCountFromServer,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  where,
} from '@angular/fire/firestore';

import { MarkupService } from 'src/app/services/markup.service';

import { ForumPostPageArgs } from 'src/app/types/forum-post-page-args';
import { ForumPostPagedResult } from 'src/app/types/forum-post-paged-result';

@Injectable()
export class ForumPostsService {
  private readonly env = inject(EnvironmentInjector);
  private readonly firestore = inject(Firestore);
  private readonly markupService = inject(MarkupService);

  private inCtx<T>(fn: () => Promise<T>): Promise<T> {
    return runInInjectionContext(this.env, fn);
  }

  private inCtx$<T>(factory: () => Observable<T>): Observable<T> {
    return defer(() => runInInjectionContext(this.env, factory));
  }

  public async addPost(post: ForumPostCreate): Promise<ForumPost | null> {
    return this.inCtx(async () => {
      try {
        const postsRef = collection(this.firestore, 'forum');
        const serialized = ForumPost.serialize(post, {
          markupService: this.markupService,
        });
        const newDoc = await addDoc(postsRef, serialized);
        const deserialized = ForumPost.deserialize(
          {
            id: newDoc.id,
            ...serialized,
            createdAt: {
              seconds: DateTime.now().toSeconds(),
              nanoseconds: 0,
            },
          },
          {
            markupService: this.markupService,
          },
        );
        return deserialized;
      } catch (error) {
        console.error('Failed to add post', error);
        return null;
      }
    });
  }

  public getPost(postId: string): Observable<ForumPost | null> {
    return this.inCtx$(() => {
      const postRef = doc(this.firestore, `forum/${postId}`);
      return docData(postRef, { idField: 'id' }).pipe(
        map((data) =>
          data
            ? ForumPost.deserialize(data, {
                markupService: this.markupService,
              })
            : null,
        ),
      );
    });
  }

  public async getPostsPage(
    {
      pageSize = 10,
      lastDoc,
      firstDoc,
      category,
      sort,
      authorId,
    }: ForumPostPageArgs = { pageSize: 10 },
  ): Promise<ForumPostPagedResult> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const key = sort?.key ?? 'createdAt';
      const dir: TableSortChangeEvent<ForumPost>['direction'] =
        sort?.direction || 'desc';

      const baseConstraints = [
        ...(category ? [where('category', '==', category)] : []),
        ...(authorId ? [where('authorId', '==', authorId)] : []),
        orderBy(key, dir),
        orderBy(documentId(), dir),
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
        ForumPost.deserialize(
          { id: d.id, ...(d.data() as object) },
          { markupService: this.markupService },
        ),
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
    authorId,
  }: {
    pageSize?: number;
    category?: ForumCategoryEnum;
    sort?: TableSortChangeEvent<ForumPost>;
    authorId?: string;
  } = {}): Promise<ForumPostPagedResult> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const key = sort?.key ?? 'createdAt';
      const dir: TableSortChangeEvent<ForumPost>['direction'] =
        sort?.direction || 'desc';

      const qRef = query(
        postsRef,
        ...(category ? [where('category', '==', category)] : []),
        ...(authorId ? [where('authorId', '==', authorId)] : []),
        orderBy(key, dir),
        orderBy(documentId(), dir),
        limitToLast(n),
      );

      const snap = await getDocs(qRef);
      const keptDocs = snap.docs.slice(
        Math.max(0, snap.docs.length - pageSize),
      );
      const posts = keptDocs.map((d) =>
        ForumPost.deserialize(
          { id: d.id, ...(d.data() as object) },
          { markupService: this.markupService },
        ),
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
    authorId?: string;
  }): Promise<number> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const constraints = [
        ...(args?.category ? [where('category', '==', args.category)] : []),
        ...(args?.authorId ? [where('authorId', '==', args.authorId)] : []),
      ] as const;
      const agg = await getCountFromServer(query(postsRef, ...constraints));
      return agg.data().count ?? 0;
    });
  }

  public async flagPost(
    postId: string,
    uid: string,
    reason?: string,
  ): Promise<FlagResult> {
    return this.inCtx(async () => {
      const flagRef = doc(this.firestore, `forum/${postId}/flags/${uid}`);
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

  public async unflagPost(postId: string, uid: string): Promise<UnflagResult> {
    return this.inCtx(async () => {
      const flagRef = doc(this.firestore, `forum/${postId}/flags/${uid}`);
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
}

export type FlagResult =
  | { ok: true }
  | { ok: false; reason: 'already-flagged' | 'needs-auth' | 'unknown' };

export type UnflagResult =
  | { ok: true }
  | {
      ok: false;
      reason: 'needs-auth' | 'not-owner' | 'retry-later' | 'unknown';
      message?: string;
    };
