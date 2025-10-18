import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedOutGuard } from 'src/app/guards';

import { PipRoute } from 'src/app/types/pip-route';

/**
 * Route configuration for the forgot password page. This route is guarded
 * by {@link isLoggedOutGuard} to prevent logged in users from accessing
 * the reset flow. The component is lazy-loaded via the pages barrel.
 */
export const FORGOT_PASSWORD_PAGE_ROUTE: PipRoute = {
  path: 'forgot-password',
  pathMatch: 'full',
  canActivate: [isLoggedOutGuard],
  data: {
    author: META_AUTHOR,
    description: 'Request a password reset for your Pip-Boy account.',
    keywords: ['Forgot Password', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Forgot Password',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.ForgotPasswordPageComponent),
};
