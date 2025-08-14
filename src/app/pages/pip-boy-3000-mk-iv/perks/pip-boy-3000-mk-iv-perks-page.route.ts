import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_PERKS_PAGE_ROUTE: PipRoute = {
  path: 'stat/perks',
  data: {
    author: META_AUTHOR,
    description: 'Perks page for the Pip-Boy 3000 Mk IV',
    keywords: ['Stat', 'Perks', 'Pip-Boy 3000 Mk IV', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'STAT > PERKS - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PerksPageComponent),
};
