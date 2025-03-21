import { PipApparelComponent } from 'src/app/pages/pip-apparel/pip-apparel.component';
import { PipAppsComponent } from 'src/app/pages/pip-apps/pip-apps.component';
import { PipAttachmentsComponent } from 'src/app/pages/pip-attachments/pip-attachments.component';
import { PipClockComponent } from 'src/app/pages/pip-clock/pip-clock.component';
import { PipConnectComponent } from 'src/app/pages/pip-connect/pip-connect.component';
import { PipDiagnosticsComponent } from 'src/app/pages/pip-diagnostics/pip-diagnostics.component';
import { PipMaintenanceComponent } from 'src/app/pages/pip-maintenance/pip-maintenance.component';
import { PipMapComponent } from 'src/app/pages/pip-map/pip-map.component';
import { PipRadioSetComponent } from 'src/app/pages/pip-radio-set/pip-radio-set.component';
import { PipRadioComponent } from 'src/app/pages/pip-radio/pip-radio.component';
import { PipStatsComponent } from 'src/app/pages/pip-stats/pip-stats.component';
import { PipStatusComponent } from 'src/app/pages/pip-status/pip-status.component';
import { PipComponent } from 'src/app/pip.component';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':tab',
    component: PipComponent,
    children: [
      { path: ':subTab', component: PipStatusComponent },
      // "STAT" Tab:
      { path: 'stat/status', component: PipStatusComponent },
      { path: 'stat/connect', component: PipConnectComponent },
      { path: 'stat/diagnostics', component: PipDiagnosticsComponent },
      // "INV" Tab:
      { path: 'inv/attachments', component: PipAttachmentsComponent },
      { path: 'inv/apparel', component: PipApparelComponent },
      { path: 'inv/apps', component: PipAppsComponent },
      { path: 'inv/games', component: PipAppsComponent },
      // "DATA" Tab:
      { path: 'data/clock', component: PipClockComponent },
      { path: 'data/stats', component: PipStatsComponent },
      { path: 'data/maintenance', component: PipMaintenanceComponent },
      // "MAP" Tab:
      { path: 'map', component: PipMapComponent },
      // "RADIO" Tab:
      { path: 'radio/play', component: PipRadioSetComponent },
      { path: 'radio/set', component: PipRadioComponent },
    ],
  },
  { path: '', redirectTo: 'stat/status', pathMatch: 'full' },
  { path: '**', redirectTo: 'stat/status' },
];
