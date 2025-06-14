import { Routes } from '@angular/router';

export const routes: Routes = [
  // Welcome page
  {
    path: '',
    loadComponent: () =>
      import('src/app/pages/welcome/welcome-page.component').then(
        (c) => c.WelcomePageComponent,
      ),
  },
  // Pip-Boy 3000
  {
    path: '3000',
    children: [
      // "STAT" Tab:
      {
        path: 'stat/status',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/status/status-page.component'
          ).then((c) => c.StatusPageComponent),
      },
      {
        path: 'stat/special',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/special/special-page.component'
          ).then((c) => c.SpecialPageComponent),
      },
      {
        path: 'stat/perks',
        loadComponent: () =>
          import('src/app/pages/pip-boy-3000/perks/perks-page.component').then(
            (c) => c.PerksPageComponent,
          ),
      },
      // "INV" Tab:
      {
        path: 'inv/weapons',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/weapons/weapons-page.component'
          ).then((c) => c.WeaponsPageComponent),
      },
      {
        path: 'inv/apparel',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/apparel/apparel-page.component'
          ).then((c) => c.ApparelPageComponent),
      },
      {
        path: 'inv/aid',
        loadComponent: () =>
          import('src/app/pages/pip-boy-3000/aid/aid-page.component').then(
            (c) => c.AidPageComponent,
          ),
      },
      // "DATA" Tab:
      {
        path: 'data/quests',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/quests/quests-page.component'
          ).then((c) => c.QuestsPageComponent),
      },
      {
        path: 'data/workshops',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/workshops/workshops-page.component'
          ).then((c) => c.WorkshopsPageComponent),
      },
      {
        path: 'data/stats',
        loadComponent: () =>
          import('src/app/pages/pip-boy-3000/stats/stats-page.component').then(
            (c) => c.StatsPageComponent,
          ),
      },
      // "MAP" Tab:
      {
        path: 'map',
        loadComponent: () =>
          import('src/app/pages/pip-boy-3000/map/map-page.component').then(
            (c) => c.MapPageComponent,
          ),
      },
      // "RADIO" Tab:
      {
        path: 'radio',
        loadComponent: () =>
          import('src/app/pages/pip-boy-3000/radio/radio-page.component').then(
            (c) => c.RadioPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
