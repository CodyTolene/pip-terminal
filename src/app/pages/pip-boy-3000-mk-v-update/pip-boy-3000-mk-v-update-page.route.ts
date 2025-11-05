import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_MK_V_UPDATE_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/update',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description:
      'Update your Pip-Boy 3000 Mk V with the latest firmware and software.',
    keywords: [
      'Pip-Boy 3000 Mk V',
      'Update',
      'CFW',
      'C-UOS',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 3000 Mk V Update',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000MkVUpdatePageComponent),
};
