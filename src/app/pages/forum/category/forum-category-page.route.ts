import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const FORUM_CATEGORY_PAGE_ROUTE: PipRoute = {
  path: 'forum/category/:id',
  pathMatch: 'full',
  canActivate: [],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  data: {
    author: META_AUTHOR,
    description: 'View forum posts by category.',
    keywords: ['Forum', 'Category', 'List', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Forum - Category',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForumCategoryPageComponent),
};
