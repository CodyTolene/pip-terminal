import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
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
  ],
};
