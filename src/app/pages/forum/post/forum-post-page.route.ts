import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedInGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

export const FORUM_POST_PAGE_ROUTE: PipRoute = {
  path: 'forum/post',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  data: {
    author: META_AUTHOR,
    description: 'Post a new topic for discussion in the forum.',
    keywords: ['Forum', 'New', 'Post', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Forum - New Post',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForumPostPageComponent),
};
