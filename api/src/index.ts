/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

export { beforeUserCreatedEvent } from './events/before-user-created.event';

import * as admin from 'firebase-admin';
import express from 'express';
import { onRequest } from 'firebase-functions/v2/https';
import { logger, setGlobalOptions } from 'firebase-functions';
import { corsCheck } from './utilities';
import { HealthCheckController } from './controllers';
import { setUsersSeed } from './data';

const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

admin.initializeApp({
  projectId: 'pip-terminal',
  storageBucket: 'pip-terminal.firebasestorage.app',
});

setGlobalOptions({ maxInstances: 5 });

const app = express();

// Middleware
app.use(corsCheck());

// Controllers
app.get('/health-check', HealthCheckController.get);

// Export the Express app as a Firebase function
export const api = onRequest(app);

// Seed development data
(async () => {
  if (isEmulator) {
    try {
      await setUsersSeed();
    } catch (e) {
      logger.error('Seeding development data failed:', e);
    }
  }
})();
