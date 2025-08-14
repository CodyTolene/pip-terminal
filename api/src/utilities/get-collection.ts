import * as admin from 'firebase-admin';

export async function getCollection<T>(
  path: string,
  queryFn?: (ref: FirebaseFirestore.CollectionReference) => FirebaseFirestore.Query
): Promise<readonly T[]> {
  const ref = admin.firestore().collection(path);
  const query = queryFn ? queryFn(ref) : ref;
  const snapshot = await query.get();
  return snapshot.docs.map(doc => doc.data() as T);
}
