import { UserProfileApi } from '../models';
import * as admin from 'firebase-admin';

export async function setUserProfile(
  uid: string,
  data: UserProfileApi,
): Promise<void> {
  const db = admin.firestore();
  const docRef = db.doc(`users/${uid}`);
  await docRef.set(data, { merge: true });
}
