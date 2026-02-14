import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const LINKS_RESOURCES_PAGE_ROUTE: PipRoute = {
  path: 'links/resources',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description:
      'Discover a curated selection of resources to enhance your experience.',
    keywords: ['Resources', ...META_DEFAULT_KEYWORDS],
    title: 'Links - Resources',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.LinksResourcesPage),
};
