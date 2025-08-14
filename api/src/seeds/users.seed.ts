import * as admin from 'firebase-admin';

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

      // eslint-disable-next-line no-console
      console.log(`Created user: ${user.email}`);

    } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'code' in err &&
        (err as Record<string, unknown>).code === 'auth/email-already-exists'
      ) {
        // eslint-disable-next-line no-console
        console.log(`User already exists: ${userSeed.email}`);
      } else {
        console.error(`Failed to create user ${userSeed.email}:`, err);
      }
      return false;
    }
  }

  return true;
}
