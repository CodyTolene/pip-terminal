import { environment } from 'src/environments/environment';

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import {
  ScreenTrackingService,
  getAnalytics,
  provideAnalytics,
} from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';
import { provideRouter } from '@angular/router';

import { PipModTerminalComponent } from './pip.component';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      {
        path: '',
        component: PipModTerminalComponent,
      },
    ]),
    provideFirebaseApp(() =>
      initializeApp(environment.google.firebase, 'pip-terminal'),
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    provideAppCheck(() => {
      const provider = new ReCaptchaEnterpriseProvider(
        '6LdjIucqAAAAAFnu6VgvMjAw3U3t8ATfwTDCwZdK',
      );
      return initializeAppCheck(undefined, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
    }),
  ],
};
