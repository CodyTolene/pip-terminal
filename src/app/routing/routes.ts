import { PageLayoutsEnum } from 'src/app/enums';

const author = 'Cody Tolene';
const defaultKeywords = [
  'Pip-Boy',
  'Terminal',
  'Pip',
  'Boy',
  'Fallout',
  'Customization',
  'Simulator',
];

export const routes: PipRoute[] = [
  // Home
  {
    path: '',
    pathMatch: 'full',
    data: {
      author,
      description:
        'Welcome to Pip-Boy.com, a comprehensive resource for all things Pip-Boy!',
      keywords: ['Home', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Welcome!',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.WelcomePageComponent),
  },
  // Login
  {
    path: 'login',
    pathMatch: 'full',
    data: {
      author,
      description: 'Login to your Pip-Boy account.',
      keywords: ['Login', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Login',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.LoginPageComponent),
  },
  // Register
  {
    path: 'register',
    pathMatch: 'full',
    data: {
      author,
      description: 'Create a new Pip-Boy account.',
      keywords: ['Register', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Register',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.RegisterPageComponent),
  },
  // Privacy Policy
  {
    path: 'privacy-policy',
    pathMatch: 'full',
    data: {
      author,
      description: 'View the privacy policy of Pip-Boy.com.',
      keywords: ['Privacy Policy', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Privacy Policy',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.PrivacyPolicyPageComponent),
  },
  // Status
  {
    path: 'status',
    pathMatch: 'full',
    data: {
      author,
      description: "View the status of Pip-Boy.com's servers.",
      keywords: ['Status', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Status',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.StatusPageComponent),
  },
  // Pip-Boy 2000 Mk VI
  {
    path: '2000-mk-vi',
    pathMatch: 'prefix', // Prefix for later tab usage.
    data: {
      author,
      description: 'Pip-Boy 2000 Mk VI device simulator!',
      keywords: ['Pip-Boy 2000 Mk VI', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_2000_MK_VI,
      title: 'Pip-Boy 2000 Mk VI Simulator',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/pages').then(
            (c) => c.PipBoy2000MkVIStatusPageComponent,
          ),
      },
    ],
  },
  // Pip-Boy 3000
  {
    path: '3000',
    pathMatch: 'prefix', // Prefix for later tab usage.
    data: {
      author,
      description: 'Pip-Boy 3000 device simulator!',
      keywords: ['Pip-Boy 3000', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000,
      title: 'Pip-Boy 3000 Simulator',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.PipBoy3000StatusPageComponent),
      },
    ],
  },
  // Pip-Boy 3000A
  {
    path: '3000a',
    pathMatch: 'prefix', // Prefix for later tab usage.
    data: {
      author,
      description: 'Pip-Boy 3000A device simulator!',
      keywords: ['Pip-Boy 3000A', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000A,
      title: 'Pip-Boy 3000A Simulator',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.PipBoy3000AStatusPageComponent),
      },
    ],
  },
  // Pip-Boy 3000 Mk IV
  {
    path: '3000-mk-iv',
    pathMatch: 'prefix', // Prefix for tab usage.
    data: {
      author,
      description: 'Pip-Boy 3000 Mk IV device simulator!',
      keywords: ['Pip-Boy 3000 Mk IV', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000_MK_IV,
      title: 'Pip-Boy 3000 Mk IV Simulator',
    },
    children: [
      // "STAT" Tab:
      {
        path: 'stat/status',
        loadComponent: () =>
          import('src/app/pages').then(
            (c) => c.PipBoy3000MkIVStatusPageComponent,
          ),
      },
      {
        path: 'stat/special',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.SpecialPageComponent),
      },
      {
        path: 'stat/perks',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.PerksPageComponent),
      },
      // "INV" Tab:
      {
        path: 'inv/weapons',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.WeaponsPageComponent),
      },
      {
        path: 'inv/apparel',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.ApparelPageComponent),
      },
      {
        path: 'inv/aid',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.AidPageComponent),
      },
      // "DATA" Tab:
      {
        path: 'data/quests',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.QuestsPageComponent),
      },
      {
        path: 'data/workshops',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.WorkshopsPageComponent),
      },
      {
        path: 'data/stats',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.StatsPageComponent),
      },
      // "MAP" Tab:
      {
        path: 'map',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.MapPageComponent),
      },
      // "RADIO" Tab:
      {
        path: 'radio',
        loadComponent: () =>
          import('src/app/pages').then((c) => c.RadioPageComponent),
      },
    ],
  },
  // Pip-Boy 3000 Mk V Companion App
  {
    path: '3000-mk-v',
    pathMatch: 'full',
    data: {
      author,
      description: 'Customize and update your Pip-Boy 3000 Mk V!',
      keywords: ['Pip-Boy 3000 Mk V', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000_MK_V,
      title: 'Pip-Boy 3000 Mk V Companion App',
    },
    loadComponent: () =>
      import('src/app/pages').then(
        (c) => c.PipBoy3000MkVCompanionPageComponent,
      ),
  },
  // Pip-Boy 3000 Mk V - Apps
  {
    path: '3000-mk-v/apps',
    pathMatch: 'full',
    data: {
      author,
      description:
        'View the apps and games available for your Pip-Boy 3000 Mk V!',
      keywords: ['Pip-Boy 3000 Mk V', 'Companion App', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000_MK_V,
      title: 'Pip-Boy 3000 Mk V Companion App',
    },
    loadComponent: () =>
      import('src/app/pages').then((c) => c.PipBoy3000MkVAppsPageComponent),
  },
  // Pip-Boy 3000 Mk V - Maintenance
  {
    path: '3000-mk-v/maintenance',
    pathMatch: 'full',
    data: {
      author,
      description: 'Maintenance options for your Pip-Boy 3000 Mk V!',
      keywords: ['Pip-Boy 3000 Mk V', 'Maintenance', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000_MK_V,
      title: 'Pip-Boy 3000 Mk V Maintenance',
    },
    loadComponent: () =>
      import('src/app/pages').then(
        (c) => c.PipBoy3000MkVMaintenancePageComponent,
      ),
  },
  // Pip-Boy 3000 Mk V - Radio
  {
    path: '3000-mk-v/radio',
    pathMatch: 'full',
    data: {
      author,
      description: 'Customize your Pip-Boy 3000 Mk V Radio!',
      keywords: ['Pip-Boy 3000 Mk V', 'Radio', ...defaultKeywords],
      layout: PageLayoutsEnum.PIP_3000_MK_V,
      title: 'Pip-Boy 3000 Mk V Radio',
    },
    children: [
      {
        path: '',
        loadComponent: () =>
          import('src/app/pages').then(
            (c) => c.PipBoy3000MkVRadioPageComponent,
          ),
      },
    ],
  },
  {
    path: '**',
    data: {
      author,
      description: '404- Page not found',
      keywords: ['404', 'Not Found', ...defaultKeywords],
      layout: PageLayoutsEnum.NONE,
      title: 'Page Not Found',
    },
    redirectTo: '',
  },
];
