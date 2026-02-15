import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const RESOURCES_PAGE_ROUTE: PipRoute = {
  path: 'resources',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description:
      'Official docs, upgrade tools, community hubs, and developer references for all Pip-Boy models.',
    keywords: ['Resources', ...META_DEFAULT_KEYWORDS],
    title: 'Resources',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.ResourcesPage),
};
