import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_2000_MK_VI_PAGE_ROUTE: PipRoute = {
  path: '2000-mk-vi',
  data: {
    author: META_AUTHOR,
    description: 'Pip-Boy 2000 Mk VI device simulator!',
    keywords: ['Pip-Boy 2000 Mk VI', ...META_DEFAULT_KEYWORDS],
    // layout: PageLayoutsEnum.PIP_2000_MK_VI, // TODO
    title: 'Pip-Boy 2000 Mk VI Simulator',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy2000MkVIPage),
};
