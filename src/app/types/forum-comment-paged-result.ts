import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { ForumComment } from 'src/app/models/forum-comment.model';

export interface ForumCommentPagedResult {
  /** Whether there are more comments to fetch in the next direction. */
  hasMoreNext: boolean;
  /** Whether there are more comments to fetch in the previous direction. */
  hasMorePrev: boolean;
  /** The comments for this page. */
  comments: readonly ForumComment[];
  /** For fetching previous comments. */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** For fetching next comments. */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}
