import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_SPECIAL_PAGE_ROUTE: PipRoute = {
  path: 'stat/special',
  data: {
    author: META_AUTHOR,
    description: 'Special page for the Pip-Boy 3000 Mk IV',
    keywords: [
      'Stat',
      'Special',
      'Pip-Boy 3000 Mk IV',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'STAT > SPECIAL - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.SpecialPageComponent),
};
