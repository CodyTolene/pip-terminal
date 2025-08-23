import { ROUTES } from 'src/app/routing';
import { appCheckProvider } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  ScreenTrackingService,
  UserTrackingService,
  getAnalytics,
  provideAnalytics,
} from '@angular/fire/analytics';
import {
  FirebaseApp,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import { connectAuthEmulator, getAuth, provideAuth } from '@angular/fire/auth';
import {
  connectFirestoreEmulator,
  getFirestore,
  provideFirestore,
} from '@angular/fire/firestore';
import {
  connectFunctionsEmulator,
  getFunctions,
  provideFunctions,
} from '@angular/fire/functions';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import {
  connectStorageEmulator,
  getStorage,
  provideStorage,
} from '@angular/fire/storage';
import { provideRouter } from '@angular/router';

import { StorageLocalService } from 'src/app/services/storage-local.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([...ROUTES]),
    provideFirebaseApp(() =>
      initializeApp(environment.google.firebase, 'pip-terminal'),
    ),
    appCheckProvider(),
    provideHttpClient(withFetch()),
    provideAuth((injector) => {
      const app = injector.get(FirebaseApp);
      const auth = getAuth(app);

      if (!environment.isProduction) {
        connectAuthEmulator(auth, 'http://127.0.0.1:9099', {
          disableWarnings: true,
        });
      }

      return auth;
    }),
    provideFirestore((injector) => {
      const app = injector.get(FirebaseApp);
      const db = getFirestore(app);

      if (!environment.isProduction) {
        connectFirestoreEmulator(db, '127.0.0.1', 8080);
      }

      return db;
    }),
    provideFunctions((injector) => {
      const app = injector.get(FirebaseApp);
      const fn = getFunctions(app, 'us-central1');

      if (!environment.isProduction) {
        connectFunctionsEmulator(fn, '127.0.0.1', 5001);
      }

      return fn;
    }),
    provideStorage((injector) => {
      const app = injector.get(FirebaseApp);
      const storage = getStorage(app);

      if (!environment.isProduction) {
        connectStorageEmulator(storage, '127.0.0.1', 9199);
      }

      return storage;
    }),
    providePerformance((injector) => {
      const app = injector.get(FirebaseApp);
      return getPerformance(app);
    }),
    provideAnalytics((injector) => {
      const app = injector.get(FirebaseApp);
      return getAnalytics(app);
    }),
    ScreenTrackingService,
    StorageLocalService,
    StorageSessionService,
    UserTrackingService,
  ],
};
