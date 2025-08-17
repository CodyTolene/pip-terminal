import { ROUTES } from 'src/app/routing';
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
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getFunctions, provideFunctions } from '@angular/fire/functions';
import { getPerformance, providePerformance } from '@angular/fire/performance';
import { provideRouter } from '@angular/router';

import { StorageLocalService } from 'src/app/services/storage-local.service';
import { StorageSessionService } from 'src/app/services/storage-session.service';

import { appCheckProvider } from 'src/app/utilities/get-app-check-provider';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([...ROUTES]),
    provideFirebaseApp(() =>
      initializeApp(environment.google.firebase, 'pip-terminal'),
    ),
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
      return getFirestore(app);
    }),
    provideFunctions((injector) => {
      const app = injector.get(FirebaseApp);
      return getFunctions(app);
    }),
    providePerformance((injector) => {
      const app = injector.get(FirebaseApp);
      return getPerformance(app);
    }),
    provideAnalytics((injector) => {
      const app = injector.get(FirebaseApp);
      return getAnalytics(app);
    }),
    // Only include App Check in prod, we use emulation locally
    // so there's no need for App Check
    ...(environment.isProduction ? [appCheckProvider()] : []),
    ScreenTrackingService,
    StorageLocalService,
    StorageSessionService,
    UserTrackingService,
  ],
};
