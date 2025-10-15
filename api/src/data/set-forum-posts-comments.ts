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

function timestampForPosition(
  position: number,
  totalPerPost: number,
): admin.firestore.Timestamp {
  const minuteHalfSize = Math.ceil(totalPerPost / 2);
  const minuteStart = totalPerPost - minuteHalfSize;

  if (position >= minuteStart) {
    const offset = position - minuteStart;
    const anchorMs = Date.UTC(2025, 0, 1, 12, 0, 0, 0);
    return admin.firestore.Timestamp.fromDate(
      new Date(anchorMs + offset * 60_000),
    );
  }

  const n = position;
  const year = 2000 + n;
  const month = n % 12;
  const day = (n % 28) + 1;
  const hour = (n * 3) % 24;
  const minute = (n * 7) % 60;
  const second = (n * 11) % 60;
  const ms = (n * 37) % 1000;

  return admin.firestore.Timestamp.fromDate(
    new Date(Date.UTC(year, month, day, hour, minute, second, ms)),
  );
}

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
  const comments: ForumCommentApi[] = [];

  for (const post of forumPosts) {
    const commentsCol = db.collection(`forum/${post.id}/comments`);

    // const countSnap = await commentsCol.count().get();
    // const existing = countSnap.data().count ?? 0;
    // const toCreate = Math.max(0, commentsPerPost - existing);
    // if (toCreate === 0) {
    //   if (logExtraInfo) {
    //     logger.info(`[seed] Post ${post.id} already has ${existing} comments`);
    //   }
    //   comments.push(existing);
    //   continue;
    // }

    // Get all existing comment docs/objects
    const existingSnap = await commentsCol.get();
    const existingDocs: readonly ForumCommentApi[] = existingSnap.docs.map(
      (d) => d.data() as ForumCommentApi,
    );
    if (existingDocs.length >= commentsPerPost) {
      if (logExtraInfo) {
        logger.info(
          `[seed] Post ${post.id} already has ${existingDocs.length} comments, skipping.`,
        );
      }
      comments.push(...existingDocs);
      continue;
    }

    const batch = db.batch();

    for (let i = 0; i < commentsPerPost; i++) {
      if (i >= commentsPerPost) break;

      const createdAt = timestampForPosition(i, commentsPerPost);
      const docRef = commentsCol.doc();

      const data: ForumCommentCreateApi = {
        authorId: adminUser.uid,
        authorName: adminUser.displayName ?? 'Admin User',
        content: `Comment ${i + 1} on post "${post.title}" (${post.id})`,
        createdAt,
        postId: post.id,
      };

      batch.set(docRef, data);
      comments.push({
        id: docRef.id,
        ...data,
        createdAt,
      } satisfies ForumCommentApi);
    }

    await batch.commit();
    if (logExtraInfo) {
      logger.info(
        `[seed] Added ${commentsPerPost} comments to post ${post.id}.`,
      );
    }
  }

  logger.info(`Finished seeding ${comments.length} forum post comments.`);

  return comments;
}
