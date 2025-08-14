import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_2000_MK_VI_STATUS_PAGE_ROUTE: PipRoute = {
  path: '',
  data: {
    author: META_AUTHOR,
    description: 'Pip-Boy 2000 Mk VI device simulator!',
    keywords: ['Pip-Boy 2000 Mk VI', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 2000 Mk VI Simulator',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy2000MkVIStatusPageComponent),
};
