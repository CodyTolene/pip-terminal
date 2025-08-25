import { environment } from 'src/environments/environment';

import { EnvironmentProviders, Provider } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';

export function appCheckProvider(): EnvironmentProviders | Provider[] {
  if (!environment.isProduction) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (self as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    return []; // Disable in development.
  }
  return provideAppCheck((injector) => {
    const app = injector.get(FirebaseApp);
    const provider = new ReCaptchaEnterpriseProvider(
      environment.google.recaptcha.apiKey,
    );
    return initializeAppCheck(app, {
      provider,
      isTokenAutoRefreshEnabled: true,
    });
  });
}
