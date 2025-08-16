import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedOutGuard } from 'src/app/guards';

export const REGISTER_PAGE_ROUTE: PipRoute = {
  path: 'register',
  pathMatch: 'full',
  canActivate: [isLoggedOutGuard],
  data: {
    author: META_AUTHOR,
    description: 'Create a new Pip-Boy account.',
    keywords: ['Register', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Register',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.RegisterPageComponent),
};
