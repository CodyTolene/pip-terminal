import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const WELCOME_PAGE_ROUTE: PipRoute = {
  path: '',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description:
      'Welcome to Pip-Boy.com, a comprehensive resource for all things Pip-Boy!',
    keywords: ['Home', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Welcome!',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.WelcomePageComponent),
};
