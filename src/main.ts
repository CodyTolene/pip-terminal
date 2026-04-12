import { bootstrapApplication } from '@angular/platform-browser';

import { PipComponent } from './app/pip.component';
import { appConfig } from './app/pip.config';

bootstrapApplication(PipComponent, appConfig).catch((err) =>
  console.error(err),
);
