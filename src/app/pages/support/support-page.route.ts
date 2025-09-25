import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const SUPPORT_PAGE_ROUTE: PipRoute = {
  path: 'support',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Get help and support for Pip-Boy applications.',
    keywords: ['Support', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Support',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.SupportPageComponent),
};
