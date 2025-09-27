import { Observable, map } from 'rxjs';
import { PipUser } from 'src/app/models';

import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  collectionData,
  orderBy,
  query,
  serverTimestamp,
} from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

import { ForumComment } from 'src/app/models/forum-comment.model';
import { ForumPost } from 'src/app/models/forum-post.model';

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

  public async addPost(
    title: string,
    content: string,
    user: PipUser | null,
  ): Promise<void> {
    if (!user || user === null) {
      throw new Error('User must be logged in to create a post');
    }

    const postsRef = collection(this.firestore, 'forum');
    const post = ForumPost.serialize({
      authorId: user.uid,
      authorName: user.displayName || user.email,
      content,
      title,
    });
    await addDoc(postsRef, post);
  }

  public getComments(postId: string): Observable<readonly ForumComment[]> {
    const commentsRef = collection(this.firestore, `forum/${postId}/comments`);
    const q = query(commentsRef, orderBy('createdAt', 'asc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(ForumComment.deserializeList),
    );
  }

  public getPosts(): Observable<readonly ForumPost[]> {
    const postsRef = collection(this.firestore, 'forum');
    const q = query(postsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }).pipe(
      map(ForumPost.deserializeList),
    );
  }
}
