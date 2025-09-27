import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumCommentApi {
  authorId: string;
  authorName: string;
  content: string;
  createdAt: FirestoreTimestampApi;
  id: string;
  postId: string;
}
