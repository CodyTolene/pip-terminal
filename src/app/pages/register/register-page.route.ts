import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { isLoggedOutGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

export const REGISTER_PAGE_ROUTE: PipRoute = {
  path: 'register',
  pathMatch: 'full',
  canActivate: [isLoggedOutGuard],
  data: {
    author: META_AUTHOR,
    description: 'Create a new Pip-Boy account.',
    keywords: ['Register', ...META_DEFAULT_KEYWORDS],
    title: 'Register',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.RegisterPageComponent),
};
