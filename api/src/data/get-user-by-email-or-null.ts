import * as admin from 'firebase-admin';

export async function getUserByEmailOrNull(
  auth: admin.auth.Auth,
  email: string,
): Promise<admin.auth.UserRecord | null> {
  try {
    return await auth.getUserByEmail(email.toLowerCase().trim());
  } catch (e: unknown) {
    if (
      typeof e === 'object' &&
      e &&
      'code' in e &&
      e.code === 'auth/user-not-found'
    ) {
      return null;
    }
    throw e;
  }
}
