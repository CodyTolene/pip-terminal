import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_APPAREL_PAGE_ROUTE: PipRoute = {
  path: 'inv/apparel',
  data: {
    author: META_AUTHOR,
    description: 'Apparel page for the Pip-Boy 3000 Mk IV',
    keywords: [
      'Inv',
      'Apparel',
      'Pip-Boy 3000 Mk IV',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'INV > APPAREL - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ApparelPageComponent),
};
