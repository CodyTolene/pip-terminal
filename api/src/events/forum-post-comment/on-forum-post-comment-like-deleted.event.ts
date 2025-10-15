import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostCommentLikeDeleted = onDocumentDeleted(
  'forum/{postId}/comments/{commentId}/likes/{uid}',
  async (event) => {
    const commentRef = event.data?.ref.parent.parent;
    if (!commentRef) {
      logger.error(
        'Comment reference not found for like delete:',
        event.params,
      );
      return;
    }
    try {
      await commentRef.update({
        likesCount: FieldValue.increment(-1),
      });
      logger.info(`Like removed from comment "${event.params.commentId}".`);
    } catch (err) {
      logger.error('Decrement comment likes failed', event.params, err);
    }
  },
);
