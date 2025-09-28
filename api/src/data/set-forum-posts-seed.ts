import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { isEmulator } from '../utilities';
import { FORUM_POSTS_SEED } from '../seeds/forum-posts.seed';
import type { ForumPostCreateApi } from '../models';

export async function setForumPostsSeed(): Promise<boolean> {
  if (!isEmulator()) {
    logger.error('Seeding forum posts is only supported in the emulator.');
    return false;
  }

  const db = admin.firestore();
  const forumCol = db.collection('forum');

  for (const item of FORUM_POSTS_SEED) {
    // TODO: Tie to user IDs from the users
    const docRef = forumCol.doc(item.id);
    const exists = (await docRef.get()).exists;
    if (exists) {
      logger.info(`Forum post already exists: ${item.id}, skipping.`);
      continue;
    }

    const { id: _omitId, createdAt, ...rest } = item;
    const ts = new admin.firestore.Timestamp(
      createdAt.seconds,
      createdAt.nanoseconds,
    );

    const docData: ForumPostCreateApi = {
      ...rest,
      createdAt: ts ?? admin.firestore.FieldValue.serverTimestamp(),
    };

    await docRef.set(docData);
    logger.info(`Created forum post: ${item.id}`);
  }

  return true;
}
