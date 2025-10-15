import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumCommentApi {
  authorId: string;
  authorName: string;
  content: string;
  createdAt: FirestoreTimestampApi;
  flagsCount: number;
  id: string;
  likesCount: number;
  postId: string;
}

export type ForumCommentCreateApi = Omit<
  ForumCommentApi,
  'createdAt' | 'flagsCount' | 'id' | 'likesCount'
> & {
  createdAt: FieldValue;
};
