import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const LINKS_SUPPORT_PAGE_ROUTE: PipRoute = {
  path: 'links/support',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description:
      'Discover a curated selection of support options to enhance your experience.',
    keywords: ['Support', ...META_DEFAULT_KEYWORDS],
    title: 'Links - Support',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.LinksSupportPage),
};
