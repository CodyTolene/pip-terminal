import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';

export const onForumPostCommentFlagCreated = onDocumentCreated(
  'forum/{postId}/comments/{commentId}/flags/{uid}',
  async (event) => {
    const commentRef = event.data?.ref.parent.parent; // /forum/{postId}/comments/{commentId}
    if (!commentRef) {
      logger.error(
        'Comment reference not found for flag create:',
        event.params,
      );
      return;
    }
    try {
      await commentRef.update({
        flagsCount: FieldValue.increment(1),
      });
      logger.info(
        `Flag added to comment "${event.params.commentId}" on post "${event.params.postId}".`,
      );
    } catch (err) {
      logger.error(
        'Error updating comment flag count (create):',
        event.params.postId,
        err,
      );
    }
  },
);
