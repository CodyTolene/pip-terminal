import { FORGOT_PASSWORD_PAGE_ROUTE } from 'src/app/pages/forgot-password/forgot-password-page.route';
import { FORUM_CATEGORY_PAGE_ROUTE } from 'src/app/pages/forum/category/category-page.route';
import { FORUM_PAGE_ROUTE } from 'src/app/pages/forum/forum-page.route';
import { FORUM_POST_PAGE_ROUTE } from 'src/app/pages/forum/post/post-page.route';
import { FORUM_VIEW_PAGE_ROUTE } from 'src/app/pages/forum/view/view-page.route';
import { HOME_PAGE_ROUTE } from 'src/app/pages/home/home-page.route';
import { LOGIN_PAGE_ROUTE } from 'src/app/pages/login/login-page.route';
import { PIP_BOY_3000_MK_V_COMPANION_PAGE_ROUTE } from 'src/app/pages/pip-boy-3000-mk-v-companion/pip-boy-3000-mk-v-companion-page.route';
import { PRIVACY_POLICY_PAGE_ROUTE } from 'src/app/pages/privacy-policy/privacy-policy-page.route';
import { REGISTER_PAGE_ROUTE } from 'src/app/pages/register/register-page.route';
import { TERMS_AND_CONDITIONS_PAGE_ROUTE } from 'src/app/pages/terms-and-conditions/terms-and-conditions-page.route';
import { VAULT_PAGE_ROUTE } from 'src/app/pages/vault/vault-page.route';
import { VERIFY_EMAIL_PAGE_ROUTE } from 'src/app/pages/verify-email/verify-email-page.route';
import { PAGE_REDIRECTS } from 'src/app/routing/page-redirects';

import { PipRoute } from 'src/app/types/pip-route';
import { PipRouteRedirect } from 'src/app/types/pip-route-redirect';

export const ROUTES: ReadonlyArray<PipRoute | PipRouteRedirect> = [
  HOME_PAGE_ROUTE, // Home page
  FORGOT_PASSWORD_PAGE_ROUTE,
  FORUM_CATEGORY_PAGE_ROUTE,
  FORUM_PAGE_ROUTE,
  FORUM_POST_PAGE_ROUTE,
  FORUM_VIEW_PAGE_ROUTE,
  LOGIN_PAGE_ROUTE,
  PIP_BOY_3000_MK_V_COMPANION_PAGE_ROUTE,
  PRIVACY_POLICY_PAGE_ROUTE,
  REGISTER_PAGE_ROUTE,
  TERMS_AND_CONDITIONS_PAGE_ROUTE,
  VAULT_PAGE_ROUTE,
  VERIFY_EMAIL_PAGE_ROUTE,
  PAGE_REDIRECTS['vault'],
  PAGE_REDIRECTS['404'],
];
