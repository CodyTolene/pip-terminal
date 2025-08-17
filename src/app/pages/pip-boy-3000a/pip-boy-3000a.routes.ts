import { PIP_BOY_3000A_STATUS_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000a/stats/status/pip-boy-3000a-status-page.route';

export const PIP_BOY_3000A_ROUTES: PipRoute = {
  path: '3000a',
  pathMatch: 'prefix',
  children: [PIP_BOY_3000A_STATUS_PAGE_ROUTE],
};
