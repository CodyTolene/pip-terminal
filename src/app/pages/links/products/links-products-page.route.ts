import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const LINKS_PRODUCTS_PAGE_ROUTE: PipRoute = {
  path: 'links/products',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description:
      'Discover a curated selection of products to enhance your experience.',
    keywords: ['Products', ...META_DEFAULT_KEYWORDS],
    title: 'Links - Products',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.LinksProductsPage),
};
