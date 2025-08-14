import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_RADIO_PAGE_ROUTE: PipRoute = {
  path: 'radio',
  data: {
    author: META_AUTHOR,
    description: 'Radio page for the Pip-Boy 3000 Mk IV',
    keywords: ['Radio', 'Pip-Boy 3000 Mk IV', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'RADIO - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.RadioPageComponent),
};
