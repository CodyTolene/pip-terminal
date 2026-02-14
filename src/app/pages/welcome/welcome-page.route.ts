import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const WELCOME_PAGE_ROUTE: PipRoute = {
  path: '',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description:
      'Welcome to Pip-Boy.com, a comprehensive resource for all things Pip-Boy!',
    keywords: ['Home', ...META_DEFAULT_KEYWORDS],
    title: 'Home',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.WelcomePageComponent),
};
