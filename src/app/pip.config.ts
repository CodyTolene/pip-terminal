import { routes } from 'src/app/pip.routes';
import { environment } from 'src/environments/environment';

import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  ScreenTrackingService,
  getAnalytics,
  provideAnalytics,
} from '@angular/fire/analytics';
import {
  FirebaseApp,
  initializeApp,
  provideFirebaseApp,
} from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { provideRouter } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideFirebaseApp(() =>
      initializeApp(environment.google.firebase, 'pip-terminal'),
    ),
    provideHttpClient(withFetch()),
    provideAnalytics((injector) => {
      const app = injector.get(FirebaseApp);
      return getAnalytics(app);
    }),
    ScreenTrackingService,
    provideAppCheck((injector) => {
      const app = injector.get(FirebaseApp);
      const provider = new ReCaptchaEnterpriseProvider(
        environment.google.recaptcha.apiKey,
      );
      return initializeAppCheck(app, {
        isTokenAutoRefreshEnabled: true,
        provider,
      });
    }),
  ],
};
