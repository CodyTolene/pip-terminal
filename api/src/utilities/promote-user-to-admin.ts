import { getAuth } from 'firebase-admin/auth';

export async function promoteToAdmin(uid: string): Promise<void> {
  await getAuth().setCustomUserClaims(uid, { role: 'admin' });
  // Revoke to force token refresh on next request
  await getAuth().revokeRefreshTokens(uid);
}
