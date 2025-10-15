import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';
import { FieldValue } from 'firebase-admin/firestore';

export const onForumPostFlagCreated = onDocumentCreated(
  'forum/{postId}/flags/{uid}',
  async (event) => {
    const postRef = event.data?.ref.parent.parent; // /forum/{postId}
    if (!postRef) {
      logger.error('Post reference not found for flag create:', event.params);
      return;
    }
    try {
      await postRef.update({
        flagsCount: FieldValue.increment(1),
      });
      logger.info(`Flag added to post "${event.params.postId}".`);
    } catch (err) {
      logger.error(
        'Error updating post flag count (create):',
        event.params.postId,
        err,
      );
    }
  },
);
