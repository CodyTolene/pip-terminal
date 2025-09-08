import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_STATUS_PAGE_ROUTE: PipRoute = {
  path: '',
  data: {
    author: META_AUTHOR,
    description: 'Pip-Boy 3000 device simulator!',
    keywords: ['Pip-Boy 3000', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    // layout: PageLayoutsEnum.PIP_3000, // TODO
    title: 'Pip-Boy 3000 Simulator',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000StatusPageComponent),
};
