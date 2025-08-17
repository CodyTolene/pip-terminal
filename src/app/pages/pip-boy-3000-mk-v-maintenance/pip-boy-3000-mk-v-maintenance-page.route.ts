import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_V_MAINTENANCE_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/maintenance',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Maintenance options for your Pip-Boy 3000 Mk V!',
    keywords: ['Pip-Boy 3000 Mk V', 'Maintenance', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.PIP_3000_MK_V,
    title: 'Pip-Boy 3000 Mk V Maintenance',
  },
  loadComponent: () =>
    import('src/app/pages').then(
      (c) => c.PipBoy3000MkVMaintenancePageComponent,
    ),
};
