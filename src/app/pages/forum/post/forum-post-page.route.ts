import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedInGuard } from 'src/app/guards/is-logged-in.guard';

import { PipRoute } from 'src/app/types/pip-route';

export const FORUM_POST_PAGE_ROUTE: PipRoute = {
  path: 'forum/post',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard],
  data: {
    author: META_AUTHOR,
    description: 'Post a new topic for discussion in the forum.',
    keywords: ['Forum', 'Community', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Forum - Post',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForumPostPageComponent),
};
