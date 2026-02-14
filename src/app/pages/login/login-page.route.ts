import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { isLoggedOutGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

export const LOGIN_PAGE_ROUTE: PipRoute = {
  path: 'login',
  pathMatch: 'full',
  canActivate: [isLoggedOutGuard],
  data: {
    author: META_AUTHOR,
    description: 'Login to your Pip-Boy account.',
    keywords: ['Login', ...META_DEFAULT_KEYWORDS],
    title: 'Login',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.LoginPageComponent),
};
