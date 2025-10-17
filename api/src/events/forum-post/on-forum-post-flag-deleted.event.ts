import { FieldValue } from 'firebase-admin/firestore';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

export const onForumPostFlagDeleted = onDocumentDeleted(
  'forum/{postId}/flags/{uid}',
  async (event) => {
    const postRef = event.data?.ref.parent.parent; // /forum/{postId}
    if (!postRef) {
      logger.error('Post reference not found for flag delete:', event.params);
      return;
    }
    try {
      await postRef.update({ flagsCount: FieldValue.increment(-1) });
      logger.info(`Flag removed from post "${event.params.postId}".`);
    } catch (err) {
      logger.error(
        'Error updating flag count (delete):',
        event.params.postId,
        err,
      );
    }
  },
);
