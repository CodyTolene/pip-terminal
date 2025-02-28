import { bootstrapApplication } from '@angular/platform-browser';

import { PipModTerminalComponent } from './app/pip.component';
import { appConfig } from './app/pip.config';

bootstrapApplication(PipModTerminalComponent, appConfig).catch((err) =>
  console.error(err),
);
