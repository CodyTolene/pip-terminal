import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_MK_V_CFW_BUILDER_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/cfw-builder',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description:
      'Build custom firmware for your Pip-Boy 3000 Mk V with the modular firmware builder.',
    keywords: [
      'Pip-Boy 3000 Mk V',
      'CFW',
      'Custom Firmware',
      'Builder',
      'Modular',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 3000 Mk V CFW Builder',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000MkVCfwBuilderPageComponent),
};
