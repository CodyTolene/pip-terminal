import { PIP_BOY_2000_MK_VI_STATUS_PAGE_ROUTE } from 'src/app/pages/pip-boy-2000-mk-vi/stat/status/pip-boy-2000-mk-vi-status-page.route';

export const PIP_BOY_2000_MK_VI_ROUTES: PipRoute = {
  path: '2000-mk-vi',
  pathMatch: 'prefix',
  children: [PIP_BOY_2000_MK_VI_STATUS_PAGE_ROUTE],
};
