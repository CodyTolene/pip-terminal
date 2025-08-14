import * as admin from 'firebase-admin';

export async function getDocument<T>(path: string): Promise<T | null> {
  const docRef = admin.firestore().doc(path);
  const doc = await docRef.get();
  return doc.exists ? (doc.data() as T) : null;
}
