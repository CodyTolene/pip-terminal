import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PipMapService {
  private isInitialized = false;

  public initialize(): Promise<void> {
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
