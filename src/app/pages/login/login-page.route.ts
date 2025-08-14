import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const LOGIN_PAGE_ROUTE: PipRoute = {
  path: 'login',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Login to your Pip-Boy account.',
    keywords: ['Login', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Login',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.LoginPageComponent),
};
