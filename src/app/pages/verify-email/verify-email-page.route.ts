import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { isLoggedInGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

export const VERIFY_EMAIL_PAGE_ROUTE: PipRoute = {
  path: 'verify-email',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard],
  data: {
    author: META_AUTHOR,
    description: 'Verify your email address to continue using the app.',
    keywords: ['Verify Email', ...META_DEFAULT_KEYWORDS],
    title: 'Verify Email',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.VerifyEmailPage),
};
