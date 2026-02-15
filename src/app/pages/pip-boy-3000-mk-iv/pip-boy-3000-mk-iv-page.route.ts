import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_MK_IV_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-iv',
  data: {
    author: META_AUTHOR,
    description: 'Pip-Boy 3000 Mk IV device simulator!',
    keywords: ['Pip-Boy 3000 Mk IV', ...META_DEFAULT_KEYWORDS],
    // layout: PageLayoutsEnum.PIP_3000_MK_IV, // TODO
    title: 'Pip-Boy 3000 Mk IV Simulator',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000MkIVPage),
};
