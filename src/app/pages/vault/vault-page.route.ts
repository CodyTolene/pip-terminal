import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { isLoggedInGuard, vaultAuthGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

export const VAULT_PAGE_ROUTE: PipRoute = {
  path: 'vault/:id',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard, vaultAuthGuard],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  data: {
    author: META_AUTHOR,
    description: "View the status of Pip-Boy.com's servers.",
    keywords: ['Vault', 'User', 'Account', ...META_DEFAULT_KEYWORDS],
    title: 'My Vault',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.VaultPage),
};
