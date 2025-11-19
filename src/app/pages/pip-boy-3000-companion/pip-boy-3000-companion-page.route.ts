import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_COMPANION_PAGE_ROUTE: PipRoute = {
  path: '3000-companion',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Customize and update your Pip-Boy 3000!',
    keywords: ['Pip-Boy', '3000', 'Companion', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 3000 Companion Terminal',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000CompanionPageComponent),
};
