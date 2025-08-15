import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { ADMINS_SEED } from '../seeds/admins.seed';
import { USERS_SEED } from '../seeds/users.seed';
import { setUserPhoto } from './set-user-photo';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { getUserByEmailOrNull } from './get-user-by-email-or-null';

export async function setUsersSeed(): Promise<boolean> {
  const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';
  if (isEmulator === false) {
    logger.error('Seeding users is only supported in the emulator.');
    return false;
  }

  const auth = admin.auth();

  // Admins
  for (const admin of ADMINS_SEED) {
    const email = admin.email.toLowerCase().trim();
    const existing = await getUserByEmailOrNull(auth, email);
    if (existing) {
      logger.info(`Admin user already exists: ${existing.email}, skipping.`);
      continue;
    }

    // Create admin user
    const created = await auth.createUser(admin);
    await auth.setCustomUserClaims(created.uid, { role: 'admin' });
    logger.info(`Created admin user: ${created.email}`);

    // Assign storage bucket image
    const localPath = path.resolve(
      __dirname,
      '../../../public/images/user/user.png',
    );
    const fileBuffer = fs.readFileSync(localPath);
    await setUserPhoto(created.uid, fileBuffer, 'image/png', 'profile.png');
    logger.info(`Uploaded profile photo for admin user: ${created.email}`);
  }

  // Users
  for (const user of USERS_SEED) {
    const email = user.email.toLowerCase().trim();
    const existing = await getUserByEmailOrNull(auth, email);
    if (existing) {
      logger.info(`User already exists: ${existing.email}, skipping.`);
      continue;
    }

    // Create user
    const created = await auth.createUser(user);
    await auth.setCustomUserClaims(created.uid, { role: 'user' });
    logger.info(`Created user: ${created.email}`);
  }

  return true;
}
