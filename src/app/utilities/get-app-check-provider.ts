import { environment } from 'src/environments/environment';

import { EnvironmentProviders, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';

export function appCheckProvider(): EnvironmentProviders | [] {
  if (!environment.isProduction) {
    // (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    return []; // Disable in development.
  }
  return provideAppCheck(() => {
    const app = inject(FirebaseApp);
    const provider = new ReCaptchaEnterpriseProvider(
      environment.google.recaptcha.apiKey,
    );
    return initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  });
}
