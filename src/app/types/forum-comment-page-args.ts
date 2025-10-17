import { TableSortChangeEvent } from '@proangular/pro-table';

import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { ForumComment } from 'src/app/models/forum-comment.model';

export interface ForumCommentPageArgs {
  /** Number of comments per page. */
  pageSize?: number;
  /** Forward cursor (Next). */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Backward cursor (Previous). */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** Optional sort specification. Defaults to createdAt desc for paging. */
  sort?: TableSortChangeEvent<ForumComment>;
}
