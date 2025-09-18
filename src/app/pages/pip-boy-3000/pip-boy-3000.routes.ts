import { PIP_BOY_3000_STATUS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000/stats/status/pip-boy-3000-status-page.route';

import { PipRoute } from 'src/app/types/pip-route';

export const PIP_BOY_3000_ROUTES: PipRoute = {
  path: '3000',
  pathMatch: 'prefix',
  children: [PIP_BOY_3000_STATUS_PAGE_ROUTE],
};
