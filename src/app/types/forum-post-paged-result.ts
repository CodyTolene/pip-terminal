import { DocumentData, QueryDocumentSnapshot } from '@angular/fire/firestore';

import { ForumPost } from 'src/app/models/forum-post.model';

export interface ForumPostPagedResult {
  /** Whether there are more posts to fetch in the next direction. */
  hasMoreNext: boolean;
  /** Whether there are more posts to fetch in the previous direction. */
  hasMorePrev: boolean;
  /** The posts for this page. */
  posts: readonly ForumPost[];
  /** For fetching previous posts. */
  firstDoc?: QueryDocumentSnapshot<DocumentData>;
  /** For fetching next posts. */
  lastDoc?: QueryDocumentSnapshot<DocumentData>;
}
