import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostLikeDeleted = onDocumentDeleted(
  'forum/{postId}/likes/{uid}',
  async (event) => {
    const postRef = event.data?.ref.parent.parent;
    if (!postRef) return;
    try {
      await postRef.update({
        likesCount: FieldValue.increment(-1),
      });
      logger.info(`Like removed from post "${event.params.postId}".`);
    } catch (err) {
      logger.error('Decrement post likes failed', event.params, err);
    }
  },
);
