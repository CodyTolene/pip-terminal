import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { logger } from 'firebase-functions';

/** Triggered whenever a new document is written to the `forum` collection. */
export const onForumPostCreated = onDocumentCreated(
  'forum/{postId}',
  async (event) => {
    const post = event.data?.data();
    if (!post) {
      return;
    }
    const authorId = post.authorId;
    const contentLength =
      typeof post.contentHtml === 'string' ? post.contentHtml.length : 0;
    logger.info(
      `Forum post created by ${authorId} with ${contentLength} characters`,
    );
  },
);
