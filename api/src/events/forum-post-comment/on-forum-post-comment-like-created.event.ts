import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostCommentLikeCreated = onDocumentCreated(
  'forum/{postId}/comments/{commentId}/likes/{uid}',
  async (event) => {
    const commentRef = event.data?.ref.parent.parent; // /forum/{postId}/comments/{commentId}
    if (!commentRef) {
      logger.error(
        'Comment reference not found for like create:',
        event.params,
      );
      return;
    }
    try {
      await commentRef.update({
        likesCount: FieldValue.increment(1),
      });
      logger.info(
        `Like added to comment "${event.params.commentId}" on post "${event.params.postId}".`,
      );
    } catch (err) {
      logger.error(
        'Error updating comment like count (create):',
        event.params.commentId,
        err,
      );
    }
  },
);
