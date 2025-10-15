import { TableSortChangeEvent } from '@proangular/pro-table';
import { ForumCategoryEnum } from 'src/app/enums/forum-category.enum';

import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { ForumPost } from 'src/app/models/forum-post.model';

export interface ForumPostPageArgs {
  /** Number of posts to return per page. */
  pageSize?: number;
  /** Forward cursor (Next). */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Backward cursor (Previous). */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Optional category filter. */
  category?: ForumCategoryEnum;
  /** Optional sort specification. */
  sort?: TableSortChangeEvent<ForumPost>;
  /** Optional author ID filter. */
  authorId?: string;
}
