import { environment } from 'src/environments/environment';

import { EnvironmentProviders, inject } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
  ReCaptchaEnterpriseProvider,
  initializeAppCheck,
  provideAppCheck,
} from '@angular/fire/app-check';

export function appCheckProvider(): EnvironmentProviders {
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
