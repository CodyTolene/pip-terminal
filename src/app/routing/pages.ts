import { PageName } from 'src/app/types/page-name';
import { PageUrl } from 'src/app/types/page-url';

/** The page name and the corresponding route URL records. */
export const PAGES: Record<PageName, PageUrl> = {
  /** Default Routes */
  'Forgot Password': 'forgot-password',
  Home: '',
  Login: 'login',
  'My Vault': `vault/:id`,
  'Page Not Found': '**',
  'Privacy Policy': 'privacy-policy',
  Register: 'register',
  Support: 'support',
  Status: 'status',
  'Terms and Conditions': 'terms-and-conditions',
  'Verify Email': 'verify-email',
  /** Forum Routes */
  Forum: 'forum',
  'Forum - Category': 'forum/category/:id',
  'Forum - New Post': 'forum/post',
  'Forum - View Post': 'forum/post/:id',
  /** Links Routes */
  Links: 'links',
  'Links - Products': 'links/products',
  'Links - Resources': 'links/resources',
  'Links - Support': 'links/support',
  /** Simulator Routes */
  'Pip-Boy 2000 Mk VI Simulator': '2000-mk-vi',
  'Pip-Boy 3000 Mk IV Simulator': '3000-mk-iv',
  'Pip-Boy 3000 Simulator': '3000',
  'Pip-Boy 3000A Simulator': '3000a',
  /** Pip-Boy 3000 Companion Terminal Routes */
  'Pip-Boy 3000 Companion Terminal': '3000-companion',
  /** Pip-Boy 3000 Mk V Companion Terminal Routes */
  'Pip-Boy 3000 Mk V Apps': '3000-mk-v/apps',
  'Pip-Boy 3000 Mk V CFW Builder': '3000-mk-v/cfw-builder',
  'Pip-Boy 3000 Mk V Companion Terminal': '3000-mk-v',
  'Pip-Boy 3000 Mk V Maintenance': '3000-mk-v/maintenance',
  'Pip-Boy 3000 Mk V File Management': '3000-mk-v/file-management',
  'Pip-Boy 3000 Mk V Radio': '3000-mk-v/radio',
  'Pip-Boy 3000 Mk V Update': '3000-mk-v/update',
};
