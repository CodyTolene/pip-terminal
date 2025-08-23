import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_IV_WORKSHOPS_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-iv/data/workshops',
  data: {
    author: META_AUTHOR,
    description: 'Workshops page for the Pip-Boy 3000 Mk IV',
    keywords: [
      'Data',
      'Workshops',
      'Pip-Boy 3000 Mk IV',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.PIP_3000_MK_IV,
    title: 'DATA > WORKSHOPS - Pip-Boy 3000 Mk IV',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.WorkshopsPageComponent),
};
