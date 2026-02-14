import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_MK_V_MAINTENANCE_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/maintenance',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Maintenance options for your Pip-Boy 3000 Mk V!',
    keywords: ['Pip-Boy 3000 Mk V', 'Maintenance', ...META_DEFAULT_KEYWORDS],
    title: 'Pip-Boy 3000 Mk V Maintenance',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.PipBoy3000MkVMaintenancePage),
};
