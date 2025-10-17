import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumFlagApi {
  createdAt: FirestoreTimestampApi;
  id: string;
  reason: string;
}

// export type ForumFlagUpdateApi = Omit<
//   ForumFlagApi,
//   'createdAt' | 'id'
// > & {
//   createdAt: FieldValue;
// };

export type ForumFlagCreateApi = Omit<ForumFlagApi, 'createdAt' | 'id'> & {
  createdAt: FieldValue;
};
