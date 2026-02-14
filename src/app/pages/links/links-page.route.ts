import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const LINKS_PAGE_ROUTE: PipRoute = {
  path: 'links',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description: 'Access a curated list of useful links and resources.',
    keywords: ['Links', ...META_DEFAULT_KEYWORDS],
    title: 'Links',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.LinksPage),
};
