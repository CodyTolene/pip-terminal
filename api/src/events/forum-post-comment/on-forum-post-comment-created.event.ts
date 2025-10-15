import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

/** Triggered whenever a new document is written to the `forum/{postId}/comments` collection. */
export const onForumPostCommentCreated = onDocumentCreated(
  'forum/{postId}/comments/{commentId}',
  async (event) => {
    const comment = event.data?.data();
    if (!comment) {
      return;
    }
    logger.info(comment);
    const authorId = comment.authorId;
    const contentLength =
      typeof comment.content === 'string' ? comment.content.length : 0;
    logger.info(
      `Forum post (${event.params.postId}) comment created by ${authorId} with ${contentLength} characters`,
    );
  },
);
