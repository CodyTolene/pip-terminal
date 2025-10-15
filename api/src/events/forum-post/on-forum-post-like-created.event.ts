import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostLikeCreated = onDocumentCreated(
  'forum/{postId}/likes/{uid}',
  async (event) => {
    const postRef = event.data?.ref.parent.parent; // /forum/{postId}
    if (!postRef) {
      logger.error('Post reference not found for like create:', event.params);
      return;
    }
    try {
      await postRef.update({
        likesCount: FieldValue.increment(1),
      });
      logger.info(`Like added to post "${event.params.postId}".`);
    } catch (err) {
      logger.error('Increment post likes failed', event.params, err);
    }
  },
);
