import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const FORUM_PAGE_ROUTE: PipRoute = {
  path: 'forum',
  pathMatch: 'full',
  canActivate: [],
  data: {
    author: META_AUTHOR,
    description:
      'Discuss your Pip-Boy, share tips and connect with other vault dwellers in the community forum.',
    keywords: ['Forum', 'Community', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Forum',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForumPageComponent),
};
