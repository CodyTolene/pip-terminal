import { Routes } from '@angular/router';

const homePath = 'stat/status';

export const routes: Routes = [
  // "STAT" Tab:
  {
    path: homePath,
    loadComponent: () =>
      import('src/app/pages/status/status-page.component').then(
        (m) => m.StatusPageComponent,
      ),
  },
  {
    path: 'stat/special',
    loadComponent: () =>
      import('src/app/pages/special/special-page.component').then(
        (m) => m.SpecialPageComponent,
      ),
  },
  {
    path: 'stat/perks',
    loadComponent: () =>
      import('src/app/pages/perks/perks-page.component').then(
        (m) => m.PerksPageComponent,
      ),
  },
  // "INV" Tab:
  {
    path: 'inv/weapons',
    loadComponent: () =>
      import('src/app/pages/weapons/weapons-page.component').then(
        (m) => m.WeaponsPageComponent,
      ),
  },
  {
    path: 'inv/apparel',
    loadComponent: () =>
      import('src/app/pages/apparel/apparel-page.component').then(
        (m) => m.ApparelPageComponent,
      ),
  },
  {
    path: 'inv/aid',
    loadComponent: () =>
      import('src/app/pages/aid/aid-page.component').then(
        (m) => m.AidPageComponent,
      ),
  },
  // "DATA" Tab:
  {
    path: 'data/quests',
    loadComponent: () =>
      import('src/app/pages/quests/quests-page.component').then(
        (m) => m.QuestsPageComponent,
      ),
  },
  {
    path: 'data/workshops',
    loadComponent: () =>
      import('src/app/pages/workshops/workshops-page.component').then(
        (m) => m.WorkshopsPageComponent,
      ),
  },
  {
    path: 'data/stats',
    loadComponent: () =>
      import('src/app/pages/stats/stats-page.component').then(
        (m) => m.StatsPageComponent,
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
    path: 'radio',
    loadComponent: () =>
      import('src/app/pages/radio/radio-page.component').then(
        (m) => m.RadioPageComponent,
      ),
  },
  { path: '', redirectTo: homePath, pathMatch: 'full' },
  { path: '**', redirectTo: homePath },
];
