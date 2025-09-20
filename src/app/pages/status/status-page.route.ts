import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const STATUS_PAGE_ROUTE: PipRoute = {
  path: 'status',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: "View the status of Pip-Boy.com's servers.",
    keywords: ['Status', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Status',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.StatusPageComponent),
};
