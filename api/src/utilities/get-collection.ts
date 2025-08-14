import * as admin from 'firebase-admin';
import { logger } from "firebase-functions";

export async function getCollection<T>(
  path: string,
  queryFn?: (ref: FirebaseFirestore.CollectionReference) => FirebaseFirestore.Query
): Promise<readonly T[]> {
  const ref = admin.firestore().collection(path);
  const query = queryFn ? queryFn(ref) : ref;
  const snapshot = await query.get();
  try {
    const data = snapshot.docs.map(doc => doc.data() as T);
    return data;
  } catch (error) {
    logger.info('Error fetching collection:', error);
    throw new Error('Failed to fetch collection');
  }
}
