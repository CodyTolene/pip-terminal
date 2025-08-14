import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_V_COMPANION_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Customize and update your Pip-Boy 3000 Mk V!',
    keywords: ['Pip-Boy 3000 Mk V', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_V,
    title: 'Pip-Boy 3000 Mk V Companion App',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000MkVCompanionPageComponent),
};
