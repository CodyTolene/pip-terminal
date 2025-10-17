import { FieldValue } from 'firebase-admin/firestore';
import { FirestoreTimestampApi } from './firestore-timestamp-api.model';

export interface ForumPostApi {
  authorId: string;
  authorName: string;
  category:
    | 'Announcements'
    | 'Cosplay'
    | 'General'
    | 'Pip-Boy 2000 Mk VI'
    | 'Pip-Boy 3000 Mk IV'
    | 'Pip-Boy 3000 Mk V'
    | 'Pip-Boy 3000'
    | 'Pip-Boy 3000A';

  contentHtml: string;
  createdAt: FirestoreTimestampApi;
  flagsCount: number;
  id: string;
  isSpoiler: boolean;
  likesCount: number;
  title: string;
}

// export type ForumPostUpdateApi = Omit<
//   ForumPostApi,
//   'createdAt' | 'flagsCount' | 'id' | 'likesCount'
// > & {
//   createdAt: FieldValue;
// };

export type ForumPostCreateApi = Omit<ForumPostApi, 'createdAt' | 'id'> & {
  createdAt: FieldValue;
};
