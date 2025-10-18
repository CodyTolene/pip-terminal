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
  /** Simulator Routes */
  'Pip-Boy 2000 Mk VI Simulator': '2000-mk-vi',
  'Pip-Boy 3000 Mk IV Simulator': '3000-mk-iv',
  'Pip-Boy 3000 Simulator': '3000',
  'Pip-Boy 3000A Simulator': '3000a',
  /** Pip-Boy 3000 Mk V Routes */
  'Pip-Boy 3000 Mk V Apps': '3000-mk-v/apps',
  'Pip-Boy 3000 Mk V Companion App': '3000-mk-v',
  'Pip-Boy 3000 Mk V Maintenance': '3000-mk-v/maintenance',
  'Pip-Boy 3000 Mk V Radio': '3000-mk-v/radio',
  /** Pip-Boy 3000 Mk IV Routes */
  'DATA > QUESTS - Pip-Boy 3000 Mk IV': '3000-mk-iv/data/quests',
  'DATA > STATS - Pip-Boy 3000 Mk IV': '3000-mk-iv/data/stats',
  'DATA > WORKSHOPS - Pip-Boy 3000 Mk IV': '3000-mk-iv/data/workshops',
  'INV > AID - Pip-Boy 3000 Mk IV': '3000-mk-iv/inv/aid',
  'INV > APPAREL - Pip-Boy 3000 Mk IV': '3000-mk-iv/inv/apparel',
  'INV > WEAPONS - Pip-Boy 3000 Mk IV': '3000-mk-iv/inv/weapons',
  'MAP - Pip-Boy 3000 Mk IV': '3000-mk-iv/map',
  'RADIO - Pip-Boy 3000 Mk IV': '3000-mk-iv/radio',
  'STAT > PERKS - Pip-Boy 3000 Mk IV': '3000-mk-iv/stat/perks',
  'STAT > SPECIAL - Pip-Boy 3000 Mk IV': '3000-mk-iv/stat/special',
  'STAT > STATUS - Pip-Boy 3000 Mk IV': '3000-mk-iv/stat/status',
};
