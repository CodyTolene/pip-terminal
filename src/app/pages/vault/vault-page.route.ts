import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const VAULT_PAGE_ROUTE: PipRoute = {
  path: 'vault/:id',
  pathMatch: 'full',
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
