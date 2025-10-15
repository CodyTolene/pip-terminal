import { TableSortChangeEvent } from '@proangular/pro-table';
import { Observable, defer, map } from 'rxjs';
import { ForumCategoryEnum } from 'src/app/enums';
import { ForumPost, ForumPostCreate } from 'src/app/models';

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

import { MarkupService } from 'src/app/services/markup.service';

import { ForumPostPageArgs } from 'src/app/types/forum-post-page-args';
import { ForumPostPagedResult } from 'src/app/types/forum-post-paged-result';

@Injectable()
export class ForumPostsService {
  private readonly firestore = inject(Firestore);
  private readonly env = inject(EnvironmentInjector);
  private readonly markupService = inject(MarkupService);

  private inCtx<T>(fn: () => Promise<T>): Promise<T> {
    return runInInjectionContext(this.env, fn);
  }

  private inCtx$<T>(factory: () => Observable<T>): Observable<T> {
    return defer(() => runInInjectionContext(this.env, factory));
  }

  public async addPost(post: ForumPostCreate): Promise<void> {
    await this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const newPost = ForumPost.serialize(post, {
        markupService: this.markupService,
      });
      await addDoc(postsRef, newPost);
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
    { pageSize = 10, lastDoc, firstDoc, category, sort }: ForumPostPageArgs = {
      pageSize: 10,
    },
  ): Promise<ForumPostPagedResult> {
    return this.inCtx(async () => {
      const postsRef = collection(this.firestore, 'forum');
      const n = pageSize + 1;

      const key = sort?.key ?? 'createdAt';
      const dir: TableSortChangeEvent<ForumPost>['direction'] =
        sort?.direction || 'desc';

      const baseConstraints = [
        ...(category ? [where('category', '==', category)] : []),
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
  }: {
    pageSize?: number;
    category?: ForumCategoryEnum;
    sort?: TableSortChangeEvent<ForumPost>;
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
