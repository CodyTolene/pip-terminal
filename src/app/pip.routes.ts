import { ApparelPageComponent } from 'src/app/pages/apparel/apparel-page.component';
import { AppsPageComponent } from 'src/app/pages/apps/apps-page.component';
import { AttachmentsPageComponent } from 'src/app/pages/attachments/attachments-page.component';
import { ClockPageComponent } from 'src/app/pages/clock/clock-page.component';
import { ConnectPageComponent } from 'src/app/pages/connect/connect-page.component';
import { DiagnosticsPageComponent } from 'src/app/pages/diagnostics/diagnostics-page.component';
import { MaintenancePageComponent } from 'src/app/pages/maintenance/maintenance-page.component';
import { MapPageComponent } from 'src/app/pages/map/map-page.component';
import { RadioSetPageComponent } from 'src/app/pages/radio-set/radio-set-page.component';
import { RadioPageComponent } from 'src/app/pages/radio/radio-page.component';
import { StatsPageComponent } from 'src/app/pages/stats/stats-page.component';
import { StatusPageComponent } from 'src/app/pages/status/status-page.component';
import { PipComponent } from 'src/app/pip.component';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':tab',
    component: PipComponent,
    children: [
      { path: ':subTab', component: StatusPageComponent },
      // "STAT" Tab:
      { path: 'stat/status', component: StatusPageComponent },
      { path: 'stat/connect', component: ConnectPageComponent },
      { path: 'stat/diagnostics', component: DiagnosticsPageComponent },
      // "INV" Tab:
      { path: 'inv/attachments', component: AttachmentsPageComponent },
      { path: 'inv/apparel', component: ApparelPageComponent },
      { path: 'inv/apps', component: AppsPageComponent },
      { path: 'inv/games', component: AppsPageComponent },
      // "DATA" Tab:
      { path: 'data/clock', component: ClockPageComponent },
      { path: 'data/stats', component: StatsPageComponent },
      { path: 'data/maintenance', component: MaintenancePageComponent },
      // "MAP" Tab:
      { path: 'map', component: MapPageComponent },
      // "RADIO" Tab:
      { path: 'radio/play', component: RadioSetPageComponent },
      { path: 'radio/set', component: RadioPageComponent },
    ],
  },
  { path: '', redirectTo: 'stat/status', pathMatch: 'full' },
  { path: '**', redirectTo: 'stat/status' },
];
