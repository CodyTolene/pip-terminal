import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_MK_V_FILE_MANAGEMENT_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/file-management',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Maintenance options for your Pip-Boy 3000 Mk V!',
    keywords: [
      'Pip-Boy 3000 Mk V',
      'File',
      'Management',
      ...META_DEFAULT_KEYWORDS,
    ],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 3000 Mk V File Management',
  },
  loadComponent: () =>
    import('src/app/pages').then(
      (c) => c.PipBoy3000MkVFileManagementPageComponent,
    ),
};
