import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { isEmulator } from '../utilities';
import { FORUM_POSTS_SEED } from '../seeds/forum-posts.seed';
import type { ForumPostCreateApi } from '../models';
import { UserRecord } from 'firebase-admin/auth';

const logExtraInfo = false;

export async function setForumPostsSeed(
  userRecord: UserRecord | undefined,
): Promise<boolean> {
  if (!isEmulator()) {
    logger.error('Seeding forum posts is only supported in the emulator.');
    return false;
  }

  const db = admin.firestore();
  const forumCol = db.collection('forum');

  for (const item of FORUM_POSTS_SEED) {
    const docRef = forumCol.doc(item.id);
    const exists = (await docRef.get()).exists;
    if (exists) {
      if (logExtraInfo) {
        logger.info(`Forum post already exists: ${item.id}, skipping.`);
      }
      continue;
    }

    const { authorId, authorName, id, createdAt, ...rest } = item;
    const ts = new admin.firestore.Timestamp(
      createdAt.seconds,
      createdAt.nanoseconds,
    );

    const docData: ForumPostCreateApi = {
      ...rest,
      authorId: userRecord?.uid ?? authorId,
      authorName: userRecord?.displayName ?? authorName,
      createdAt: ts ?? admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(docData);
    if (logExtraInfo) {
      logger.info(`Created forum post: ${id}`);
    }
  }

  logger.info(`Finished seeding ${FORUM_POSTS_SEED.length} forum posts.`);

  return true;
}
