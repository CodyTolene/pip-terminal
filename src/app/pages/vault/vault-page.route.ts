import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedInGuard, vaultAuthGuard } from 'src/app/guards';

export const VAULT_PAGE_ROUTE: PipRoute = {
  path: 'vault/:id',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard, vaultAuthGuard],
  runGuardsAndResolvers: 'paramsOrQueryParamsChange',
  data: {
    author: META_AUTHOR,
    description: "View the status of Pip-Boy.com's servers.",
    keywords: ['Vault', 'User', 'Account', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Vault',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.VaultPageComponent),
};
