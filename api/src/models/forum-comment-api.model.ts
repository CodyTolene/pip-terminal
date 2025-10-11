import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumCommentApi {
  authorId: string;
  authorName: string;
  content: string;
  createdAt: FirestoreTimestampApi;
  id: string;
  postId: string;
}

export type ForumCommentCreateApi = Omit<
  ForumCommentApi,
  'createdAt' | 'id'
> & {
  createdAt: FieldValue;
};
