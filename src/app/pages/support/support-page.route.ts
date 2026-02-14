import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const SUPPORT_PAGE_ROUTE: PipRoute = {
  path: 'support',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Get help and support for Pip-Boy applications.',
    keywords: ['Support', ...META_DEFAULT_KEYWORDS],
    title: 'Support',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.SupportPageComponent),
};
