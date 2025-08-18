import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_AID_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-iv/inv/aid',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Aid page for the Pip-Boy 3000 Mk IV',
    keywords: ['Inv', 'Aid', 'Pip-Boy 3000 Mk IV', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'INV > AID - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.AidPageComponent),
};
