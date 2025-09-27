import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumPostApi {
  authorId: string;
  authorName: string;
  content: string;
  createdAt: FirestoreTimestampApi;
  id: string;
  title: string;
}

export type ForumPostCreateApi = Omit<ForumPostApi, 'createdAt' | 'id'> & {
  createdAt: FieldValue;
};
