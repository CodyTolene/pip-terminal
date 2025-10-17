import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostCommentFlagDeleted = onDocumentDeleted(
  'forum/{postId}/comments/{commentId}/flags/{uid}',
  async (event) => {
    const commentRef = event.data?.ref.parent.parent; // /forum/{postId}/comments/{commentId}
    if (!commentRef) {
      logger.error(
        'Comment reference not found for flag delete:',
        event.params,
      );
      return;
    }
    try {
      await commentRef.update({ flagsCount: FieldValue.increment(-1) });
      logger.info(
        `Flag removed from comment "${event.params.commentId}" on post "${event.params.postId}".`,
      );
    } catch (err) {
      logger.error('Decrement comment flags failed', event.params, err);
    }
  },
);
