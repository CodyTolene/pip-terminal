import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const FORUM_VIEW_PAGE_ROUTE: PipRoute = {
  path: 'forum/post/:id',
  pathMatch: 'full',
  canActivate: [],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  data: {
    author: META_AUTHOR,
    description:
      'View a specified post and its comments in the community forum.',
    keywords: ['Forum', 'View', 'Post', ...META_DEFAULT_KEYWORDS],
    title: 'Forum - View Post',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForumViewPageComponent),
};
