import * as admin from 'firebase-admin';
import { logger } from "firebase-functions";

export async function usersSeed(): Promise<boolean> {
  const auth = admin.auth();

  // Seed Auth Users
  const userSeeds = [
    {
      email: 'support@pip-boy.com',
      password: 'SupportPassword000',
      displayName: 'Support Team',
    }
  ];

  for (const userSeed of userSeeds) {
    try {
      const user = await auth.createUser(userSeed);

      logger.info(`Created user: ${user.email}`);

    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as Record<string, unknown>).code === 'auth/email-already-exists'
      ) {
        logger.info(`User already exists: ${userSeed.email}`);
      } else {
        console.error(`Failed to create user ${userSeed.email}:`, err);
      }
      return false;
    }
  }

  return true;
}
