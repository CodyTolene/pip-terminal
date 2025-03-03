import { environment } from 'src/environments/environment';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PipMapService {
  private isLoaded = false;

  public load(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.google.maps.apiKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
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
