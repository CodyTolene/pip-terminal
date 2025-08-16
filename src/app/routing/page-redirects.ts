import { vaultAuthGuard } from 'src/app/guards';

export const PAGE_REDIRECTS: Record<string, PipRouteRedirect> = {
  '404': { path: '**', redirectTo: '' },
  // Redirects to the vault page if the user is logged in, otherwise redirects
  // to the home page
  vault: {
    path: 'vault',
    pathMatch: 'full',
    canActivate: [vaultAuthGuard],
    loadComponent: () =>
      import('src/app/pages').then((c) => c.VaultPageComponent),
  },
};
