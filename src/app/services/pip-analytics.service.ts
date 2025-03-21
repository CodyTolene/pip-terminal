import { isNonEmptyString } from '@proangular/pro-form';
import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PipAnalyticsService {
  private isInitialized = false;

  public async initialize(): Promise<void> {
    const { measurementId } = environment.google.firebase;

    if (this.isInitialized) {
      console.warn('Google Analytics is already initialized!');
      return Promise.resolve();
    } else if (!environment.production) {
      // eslint-disable-next-line no-console
      console.info('Google Analytics disabled in development mode.');
      return Promise.resolve();
    } else if (!isNonEmptyString(measurementId)) {
      throw new Error('Google Analytics measurement ID is not set');
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];

        const gtag = (...args: unknown[]): void => {
          window.dataLayer.push(...args);
        };

        window.gtag = gtag;
        window.gtag('js', new Date());
        window.gtag('config', measurementId);

        this.isInitialized = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error('Failed to load Google Analytics script', error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}
