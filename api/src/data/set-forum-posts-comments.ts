import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { UserRecord } from 'firebase-admin/auth';
import {
  ForumCommentApi,
  ForumCommentCreateApi,
  ForumPostApi,
} from '../models';
import { isEmulator } from '../utilities';

const logExtraInfo = false;

export async function setForumPostsCommentsSeed(
  adminUser: UserRecord | undefined,
  forumPosts: readonly ForumPostApi[] | null,
  commentsPerPost = 20,
): Promise<readonly ForumCommentApi[] | null> {
  if (!isEmulator()) {
    logger.error('Seeding forum posts is only supported in the emulator.');
    return null;
  }
  if (!adminUser) {
    logger.error('Seeding forum posts comments requires an admin user.');
    return null;
  }
  if (!forumPosts || forumPosts.length === 0) {
    logger.error('Seeding forum posts comments requires existing forum posts.');
    return null;
  }

  const db = admin.firestore();
  const createdAll: ForumCommentApi[] = [];

  for (const post of forumPosts) {
    const commentsCol = db.collection(`forum/${post.id}/comments`);

    const countSnap = await commentsCol.count().get();
    const existing = countSnap.data().count ?? 0;

    const toCreate = Math.max(0, commentsPerPost - existing);
    if (toCreate === 0) {
      if (logExtraInfo) {
        logger.info(`[seed] Post ${post.id} already has ${existing} comments`);
      }
      continue;
    }

    const batch = db.batch();
    const baseMs = Date.now() - toCreate * 1000;

    for (let i = 0; i < toCreate; i++) {
      const docRef = commentsCol.doc();
      const createdAt = admin.firestore.Timestamp.fromMillis(baseMs + i * 1000);

      const data: ForumCommentCreateApi = {
        authorId: adminUser.uid,
        authorName: adminUser.displayName ?? 'Admin User',
        content: `Comment ${existing + i + 1} on post "${post.title}" (${post.id})`,
        createdAt,
        postId: post.id,
      };

      batch.set(docRef, data);

      createdAll.push({
        id: docRef.id,
        ...data,
        createdAt,
      } satisfies ForumCommentApi);
    }

    await batch.commit();
    if (logExtraInfo) {
      logger.info(
        `[seed] Added ${toCreate} comments to post ${post.id} (now ${existing + toCreate}/${commentsPerPost})`,
      );
    }
  }

  return createdAll;
}
