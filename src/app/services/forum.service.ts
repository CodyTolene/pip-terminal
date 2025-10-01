import { Observable, map } from 'rxjs';
import { PipUser } from 'src/app/models';

import { Injectable, inject } from '@angular/core';
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
  serverTimestamp,
  startAfter,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

import { ForumComment } from 'src/app/models/forum-comment.model';
import { ForumPost, ForumPostCreate } from 'src/app/models/forum-post.model';

@Injectable({ providedIn: 'root' })
export class ForumService {
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  public async addComment(
    postId: string,
    content: string,
    user: PipUser | null,
  ): Promise<void> {
    if (!user) {
      throw new Error('User must be logged in to add a comment');
    }

    const commentsRef = collection(this.firestore, `forum/${postId}/comments`);
    await addDoc(commentsRef, {
      authorId: user.uid,
      authorName: user.displayName || user.email || 'Anonymous',
      content,
      postId,
      createdAt: serverTimestamp(),
    });
  }

  public async addPost(post: ForumPostCreate): Promise<void> {
    const postsRef = collection(this.firestore, 'forum');
    const newPost = ForumPost.serialize(post);
    await addDoc(postsRef, newPost);
  }

  public getComments(postId: string): Observable<readonly ForumComment[]> {
    const commentsRef = collection(this.firestore, `forum/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(ForumComment.deserializeList),
    );
  }

  public getPost(postId: string): Observable<ForumPost | null> {
    const post = doc(this.firestore, `forum/${postId}`);
    return docData(post, { idField: 'id' }).pipe(
      map((data) => (data ? ForumPost.deserialize(data) : null)),
    );
  }

  // public getAllPosts(): Observable<readonly ForumPost[]> {
  //   const postsRef = collection(this.firestore, 'forum');
  //   const q = query(postsRef, orderBy('createdAt', 'desc'));
  //   return collectionData(q, { idField: 'id' }).pipe(
  //     map(ForumPost.deserializeList),
  //   );
  // }

  public async getPostsPage(
    { pageSize = 10, lastDoc, firstDoc }: PostPageArgs = { pageSize: 10 },
  ): Promise<PostPage> {
    const postsRef = collection(this.firestore, 'forum');
    const n = pageSize + 1;

    let q;
    if (firstDoc) {
      // Previous
      q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        endBefore(firstDoc),
        limitToLast(n),
      );
    } else if (lastDoc) {
      // Next
      q = query(
        postsRef,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(n),
      );
    } else {
      // First page
      q = query(postsRef, orderBy('createdAt', 'desc'), limit(n));
    }

    const snap = await getDocs(q);
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
  }

  public async getPostsTotal(): Promise<number> {
    const postsRef = collection(this.firestore, 'forum');
    const agg = await getCountFromServer(query(postsRef));
    return agg.data().count ?? 0;
  }
}

export interface PostPage {
  /** The posts for this page. */
  posts: ForumPost[];
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
}
