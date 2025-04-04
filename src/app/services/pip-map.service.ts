import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

/**
 * Service responsible for initializing the Google Maps JavaScript API.
 */
@Injectable({ providedIn: 'root' })
export class PipMapService {
  private isInitialized = false;

  /**
   * Initializes the Google Maps JavaScript API.
   *
   * @returns A promise that resolves when the API is loaded.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.google.maps.apiKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isInitialized = true;
        resolve();
      };

      script.onerror = (error) => {
        console.error('Failed to load Google Maps script', error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  }
}
