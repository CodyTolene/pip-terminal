import { PipComponent } from 'src/app/pip.component';

import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: ':tab',
    component: PipComponent,
    children: [
      {
        path: ':subTab',
        loadComponent: () =>
          import('src/app/pages/status/status-page.component').then(
            (m) => m.StatusPageComponent,
          ),
      },
      // "STAT" Tab:
      {
        path: 'stat/status',
        loadComponent: () =>
          import('src/app/pages/status/status-page.component').then(
            (m) => m.StatusPageComponent,
          ),
      },
      {
        path: 'stat/connect',
        loadComponent: () =>
          import('src/app/pages/connect/connect-page.component').then(
            (m) => m.ConnectPageComponent,
          ),
      },
      {
        path: 'stat/diagnostics',
        loadComponent: () =>
          import('src/app/pages/diagnostics/diagnostics-page.component').then(
            (m) => m.DiagnosticsPageComponent,
          ),
      },
      // "INV" Tab:
      {
        path: 'inv/apparel',
        loadComponent: () =>
          import('src/app/pages/apparel/apparel-page.component').then(
            (m) => m.ApparelPageComponent,
          ),
      },
      {
        path: 'inv/apps',
        loadComponent: () =>
          import('src/app/pages/apps/apps-page.component').then(
            (m) => m.AppsPageComponent,
          ),
      },
      {
        path: 'inv/games',
        loadComponent: () =>
          import('src/app/pages/apps/apps-page.component').then(
            (m) => m.AppsPageComponent,
          ),
      },
      {
        path: 'inv/privacy',
        loadComponent: () =>
          import(
            'src/app/pages/privacy-policy/privacy-policy-page.component'
          ).then((m) => m.PrivacyPolicyPageComponent),
      },
      // "DATA" Tab:
      {
        path: 'data/clock',
        loadComponent: () =>
          import('src/app/pages/clock/clock-page.component').then(
            (m) => m.ClockPageComponent,
          ),
      },
      {
        path: 'data/stats',
        loadComponent: () =>
          import('src/app/pages/stats/stats-page.component').then(
            (m) => m.StatsPageComponent,
          ),
      },
      {
        path: 'data/maintenance',
        loadComponent: () =>
          import('src/app/pages/maintenance/maintenance-page.component').then(
            (m) => m.MaintenancePageComponent,
          ),
      },
      // "MAP" Tab:
      {
        path: 'map',
        loadComponent: () =>
          import('src/app/pages/map/map-page.component').then(
            (m) => m.MapPageComponent,
          ),
      },
      // "RADIO" Tab:
      {
        path: 'radio/play',
        loadComponent: () =>
          import('src/app/pages/radio-set/radio-set-page.component').then(
            (m) => m.RadioSetPageComponent,
          ),
      },
      {
        path: 'radio/set',
        loadComponent: () =>
          import('src/app/pages/radio/radio-page.component').then(
            (m) => m.RadioPageComponent,
          ),
      },
    ],
  },
  { path: '', redirectTo: 'stat/status', pathMatch: 'full' },
  { path: '**', redirectTo: 'stat/status' },
];
