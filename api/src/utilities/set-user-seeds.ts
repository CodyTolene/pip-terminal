import * as admin from 'firebase-admin';
import { logger } from 'firebase-functions';
import { getUserByEmailOrNull } from '.';
import { ADMINS_SEED } from '../seeds/admins.seed';
import { USERS_SEED } from '../seeds/users.seed';

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

    const newUser: UserCreate = {
      displayName: admin.displayName,
      email,
      password: admin.password,
    };
    const created = await auth.createUser(newUser);
    await auth.setCustomUserClaims(created.uid, { role: 'admin' });
    logger.info(`Created admin user: ${created.email}`);
  }

  // Users
  for (const user of USERS_SEED) {
    const email = user.email.toLowerCase().trim();
    const existing = await getUserByEmailOrNull(auth, email);
    if (existing) {
      logger.info(`User already exists: ${existing.email}, skipping.`);
      continue;
    }

    const newUser: UserCreate = {
      displayName: user.displayName,
      email,
      password: user.password,
    };
    const created = await auth.createUser(newUser);
    await auth.setCustomUserClaims(created.uid, { role: 'user' });
    logger.info(`Created user: ${created.email}`);
  }

  return true;
}
