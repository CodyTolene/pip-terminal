import { PipComponent } from 'src/app/pip.component';

import { Routes } from '@angular/router';

import { PipAidComponent } from 'src/app/components/pip-aid/pip-aid.component';
import { PipApparelComponent } from 'src/app/components/pip-apparel/pip-apparel.component';
import { PipAttachmentsComponent } from 'src/app/components/pip-attachments/pip-attachments.component';
import { PipClockComponent } from 'src/app/components/pip-clock/pip-clock.component';
import { PipConnectComponent } from 'src/app/components/pip-connect/pip-connect.component';
import { PipDiagnosticsComponent } from 'src/app/components/pip-diagnostics/pip-diagnostics.component';
import { PipMaintenanceComponent } from 'src/app/components/pip-maintenance/pip-maintenance.component';
import { PipMapComponent } from 'src/app/components/pip-map/pip-map.component';
import { PipRadioComponent } from 'src/app/components/pip-radio/pip-radio.component';
import { PipStatsComponent } from 'src/app/components/pip-stats/pip-stats.component';
import { PipStatusComponent } from 'src/app/components/pip-status/pip-status.component';

export const routes: Routes = [
  {
    path: ':tab',
    component: PipComponent,
    children: [
      { path: ':subTab', component: PipStatusComponent },
      { path: 'connect', component: PipConnectComponent },
      { path: 'diagnostics', component: PipDiagnosticsComponent },
      { path: 'attachments', component: PipAttachmentsComponent },
      { path: 'apparel', component: PipApparelComponent },
      { path: 'aid', component: PipAidComponent },
      { path: 'clock', component: PipClockComponent },
      { path: 'stats', component: PipStatsComponent },
      { path: 'maintenance', component: PipMaintenanceComponent },
      { path: 'map', component: PipMapComponent },
      { path: 'radio', component: PipRadioComponent },
    ],
  },
  { path: '', redirectTo: 'stat/status', pathMatch: 'full' },
  { path: '**', redirectTo: 'stat/status' },
];
