import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { ADMINS_SEED } from '../seeds/admins.seed';
import { USERS_SEED } from '../seeds/users.seed';
import { setUserPhoto } from './set-user-photo';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getUserByEmailOrNull } from './get-user-by-email-or-null';
import { isEmulator } from '../utilities';
import { setUserProfile } from './set-user-profile';
import { UserRecord } from 'firebase-admin/auth';

const logExtraInfo = false;

export async function setUsersSeed(): Promise<readonly UserRecord[] | null> {
  if (!isEmulator()) {
    logger.error('Seeding users is only supported in the emulator.');
    return null;
  }

  const auth = admin.auth();

  const users: UserRecord[] = [];

  // Admins
  for (const { native, profile } of ADMINS_SEED) {
    const email = native.email.toLowerCase().trim();
    const existing = await getUserByEmailOrNull(auth, email);
    if (existing) {
      if (logExtraInfo) {
        logger.info(`Admin user already exists: ${existing.email}, skipping.`);
      }
      continue;
    }

    // Create admin user
    const created = await auth.createUser(native);
    await auth.setCustomUserClaims(created.uid, { role: 'admin' });
    await setUserProfile(created.uid, profile);

    if (logExtraInfo) {
      logger.info(`Created admin user: ${created.email}`);
    }

    // Assign storage bucket image
    const localPath = path.resolve(
      __dirname,
      '../../../public/images/user/user.png',
    );
    const fileBuffer = fs.readFileSync(localPath);
    await setUserPhoto(created.uid, fileBuffer, 'image/png', 'profile.png');
    if (logExtraInfo) {
      logger.info(`Uploaded profile photo for admin user: ${created.email}`);
    }
    users.push(created);
  }

  // Users
  for (const { native, profile } of USERS_SEED) {
    const email = native.email.toLowerCase().trim();
    const existing = await getUserByEmailOrNull(auth, email);
    if (existing) {
      if (logExtraInfo) {
        logger.info(`User already exists: ${existing.email}, skipping.`);
      }
      continue;
    }

    // Create user
    const created = await auth.createUser(native);
    await auth.setCustomUserClaims(created.uid, { role: 'user' });
    await setUserProfile(created.uid, profile);
    if (logExtraInfo) {
      logger.info(`Created user: ${created.email}`);
    }
    users.push(created);
  }

  logger.info(`Finished seeding ${users.length} users.`);

  return users.length > 0 ? users : null;
}
