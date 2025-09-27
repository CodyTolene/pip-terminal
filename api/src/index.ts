/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

export { beforeUserCreatedEvent } from './events/before-user-created.event';
export { onForumPostCreated } from './events/on-forum-post-created.event';

import * as admin from 'firebase-admin';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { logger, setGlobalOptions } from 'firebase-functions';
import { corsCheck, isEmulator } from './utilities';
import { HealthCheckController } from './controllers';
import { setUsersSeed } from './data';

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

// Seed development data in emulator mode only
void (async () => {
  if (isEmulator()) {
    try {
      await setUsersSeed();
    } catch (e) {
      logger.error('Seeding development data failed:', e);
    }
  }
})();
