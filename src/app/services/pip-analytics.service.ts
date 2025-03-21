import { isNonEmptyString } from '@proangular/pro-form';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PipAnalyticsService {
  private isInitialized = false;

  public initialize(): void {
    const { production: isProduction } = environment;
    const { measurementId } = environment.google.firebase;

    if (this.isInitialized) {
      console.warn('Google Analytics is already initialized!');
      return;
    } else if (!isProduction) {
      // eslint-disable-next-line no-console
      console.info('Google Analytics disabled in development mode.');
      return;
    } else if (!isNonEmptyString(measurementId)) {
      throw new Error('Google Analytics measurement ID is not set');
    }

    this.loadGoogleAnalytics(measurementId);
    this.isInitialized = true;
  }

  private loadGoogleAnalytics(measurementId: string): void {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    script.onload = () => {
      window.dataLayer = window.dataLayer || [];

      const gtag = (...args: unknown[]): void => {
        window.dataLayer.push(...args);
      };

      window.gtag = gtag;
      window.gtag('js', new Date());
      window.gtag('config', measurementId);
    };
  }
}
