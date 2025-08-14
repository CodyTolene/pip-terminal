/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import * as admin from 'firebase-admin';
import express from 'express';
import { usersSeed } from './seeds';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from "firebase-functions";
import { corsCheck } from './utilities';
import { HealthCheckController } from './controllers';

const isEmulator = process.env.FUNCTIONS_EMULATOR === 'true';

const err = (message: string, ...args: unknown[]): void => {
  console.error(`[${new Date().toISOString()}] ${message}`, ...args);
};
const log = (message: string): void => {
  // eslint-disable-next-line no-console
  console.log(`[${new Date().toISOString()}] ${message}`);
};

admin.initializeApp({
  projectId: 'pip-terminal',
});

(async () => {
  if (isEmulator) {
    log('Seeding development data...');
    try {
      await usersSeed();
      log('Seeding development data complete.');
    } catch (e) {
      err('Seeding development data failed:', e);
    }
  }
})();

setGlobalOptions({ maxInstances: 5 });
const app = express();

// Middleware
app.use(corsCheck());

// Controllers
app.get('/health-check', HealthCheckController.get);

// Export the Express app as a Firebase function
export const api = onRequest(app);
