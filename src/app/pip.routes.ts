import { PipUrlsEnum } from 'src/app/enums';

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
  // Pip-Boy 2000
  {
    path: PipUrlsEnum.PIP_2000,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-2000/status/pip-boy-2000-status-page.component'
          ).then((c) => c.PipBoy2000StatusPageComponent),
      },
    ],
  },
  // Pip-Boy 3000
  {
    path: PipUrlsEnum.PIP_3000,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000/status/pip-boy-3000-status-page.component'
          ).then((c) => c.PipBoy3000StatusPageComponent),
      },
    ],
  },
  // Pip-Boy 3000 Mk IV
  {
    path: PipUrlsEnum.PIP_3000_MK_IV,
    pathMatch: 'prefix',
    children: [
      // "STAT" Tab:
      {
        path: 'stat/status',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/status/status-page.component'
          ).then((c) => c.StatusPageComponent),
      },
      {
        path: 'stat/special',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/special/special-page.component'
          ).then((c) => c.SpecialPageComponent),
      },
      {
        path: 'stat/perks',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/perks/perks-page.component'
          ).then((c) => c.PerksPageComponent),
      },
      // "INV" Tab:
      {
        path: 'inv/weapons',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/weapons/weapons-page.component'
          ).then((c) => c.WeaponsPageComponent),
      },
      {
        path: 'inv/apparel',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/apparel/apparel-page.component'
          ).then((c) => c.ApparelPageComponent),
      },
      {
        path: 'inv/aid',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/aid/aid-page.component'
          ).then((c) => c.AidPageComponent),
      },
      // "DATA" Tab:
      {
        path: 'data/quests',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/quests/quests-page.component'
          ).then((c) => c.QuestsPageComponent),
      },
      {
        path: 'data/workshops',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/workshops/workshops-page.component'
          ).then((c) => c.WorkshopsPageComponent),
      },
      {
        path: 'data/stats',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/stats/stats-page.component'
          ).then((c) => c.StatsPageComponent),
      },
      // "MAP" Tab:
      {
        path: 'map',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/map/map-page.component'
          ).then((c) => c.MapPageComponent),
      },
      // "RADIO" Tab:
      {
        path: 'radio',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-iv/radio/radio-page.component'
          ).then((c) => c.RadioPageComponent),
      },
    ],
  },
  // Pip-Boy 3000 Mk V Companion
  {
    path: PipUrlsEnum.PIP_3000_MK_V,
    pathMatch: 'prefix',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            'src/app/pages/pip-boy-3000-mk-v-companion/pip-boy-3000-mk-v-companion-page.component'
          ).then((c) => c.PipBoy3000MkVCompanionPageComponent),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
