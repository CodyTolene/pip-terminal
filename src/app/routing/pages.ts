import { PageName } from 'src/app/types/page-name';
import { PageUrl } from 'src/app/types/page-url';

/** The page name and the corresponding route URL records. */
export const PAGES: Record<PageName, PageUrl> = {
  Forum: 'forum',
  'Forum - Category': 'forum/category/:id',
  'Forum - New Post': 'forum/post',
  'Forum - View Post': 'forum/post/:id',
  'Forgot Password': 'forgot-password',
  Home: '',
  Login: 'login',
  'My Vault': `vault/:id`,
  'Page Not Found': '**',
  'Pip-Boy 3000 Mk V Companion Terminal': '3000-mk-v',
  'Privacy Policy': 'privacy-policy',
  Register: 'register',
  'Terms and Conditions': 'terms-and-conditions',
  'Verify Email': 'verify-email',
};
