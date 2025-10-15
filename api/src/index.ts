/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// User Events
export { beforeUserCreatedEvent } from './events/users/before-user-created.event';

// Forum post and comment on-create events
// export { onForumPostCreated } from './events/on-forum-post-created.event';
// export { onForumPostCommentCreated } from './events/forum-post-comment/on-forum-post-comment-created.event';

// Forum Post Events
export { onForumPostFlagCreated } from './events/forum-post/on-forum-post-flag-created.event';
export { onForumPostFlagDeleted } from './events/forum-post/on-forum-post-flag-deleted.event';
export { onForumPostLikeCreated } from './events/forum-post/on-forum-post-like-created.event';
export { onForumPostLikeDeleted } from './events/forum-post/on-forum-post-like-deleted.event';

// Forum Comment Events
export { onForumPostCommentFlagCreated } from './events/forum-post-comment/on-forum-post-comment-flag-created.event';
export { onForumPostCommentFlagDeleted } from './events/forum-post-comment/on-forum-post-comment-flag-deleted.event';
export { onForumPostCommentLikeCreated } from './events/forum-post-comment/on-forum-post-comment-like-created.event';
export { onForumPostCommentLikeDeleted } from './events/forum-post-comment/on-forum-post-comment-like-deleted.event';

import * as admin from 'firebase-admin';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { logger, setGlobalOptions } from 'firebase-functions';
import { corsCheck, isEmulator } from './utilities';
import { HealthCheckController } from './controllers';
import {
  setForumPostsCommentsSeed,
  setForumPostsSeed,
  setUsersSeed,
} from './data';
import { ADMINS_SEED } from './seeds';

// Initialize the admin SDK with the project ID and storage bucket.
admin.initializeApp({
  projectId: 'pip-terminal',
  storageBucket: 'pip-terminal.firebasestorage.app',
});

// Restrict concurrency on all functions
setGlobalOptions({ maxInstances: 5 });

// Create an Express app for HTTP triggered functions
const app = express();

// Middleware
app.use(corsCheck());

// Controllers
app.get('/health-check', HealthCheckController.get);

// Export the Express app as a Firebase function
export const api = onRequest(
  { region: 'us-central1', secrets: ['ADMIN_EMAILS'] },
  app,
);

const ENABLE_USER_SEEDS = true;
const ENABLE_POSTS_SEEDS = true;

// Seed development data
void (async () => {
  if (isEmulator()) {
    try {
      if (ENABLE_USER_SEEDS) {
        // Set users
        const newUsers = await setUsersSeed();

        // Get reference to an admin user
        const adminUser = newUsers?.find(
          ({ email }) => email === ADMINS_SEED[0].native.email,
        );

        // Reference to a non-admin user
        // const user = newUsers?.find(
        //   ({ email }) => email === USERS_SEED[0].native.email,
        // );

        if (ENABLE_POSTS_SEEDS) {
          // Add new posts by the admin user
          const newPosts = await setForumPostsSeed(adminUser);

          // Add comments to the new posts
          await setForumPostsCommentsSeed(adminUser, newPosts);
        }
      }
    } catch (e) {
      logger.error('Seeding development data failed:', e);
    }
  }
})();
