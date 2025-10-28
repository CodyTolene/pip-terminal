const PIP_BOY_3000_MK_IV_PAGE_NAMES = [
  'DATA > QUESTS - Pip-Boy 3000 Mk IV',
  'DATA > STATS - Pip-Boy 3000 Mk IV',
  'DATA > WORKSHOPS - Pip-Boy 3000 Mk IV',
  'INV > AID - Pip-Boy 3000 Mk IV',
  'INV > APPAREL - Pip-Boy 3000 Mk IV',
  'INV > WEAPONS - Pip-Boy 3000 Mk IV',
  'MAP - Pip-Boy 3000 Mk IV',
  'RADIO - Pip-Boy 3000 Mk IV',
  'STAT > PERKS - Pip-Boy 3000 Mk IV',
  'STAT > SPECIAL - Pip-Boy 3000 Mk IV',
  'STAT > STATUS - Pip-Boy 3000 Mk IV',
] as const;

const PIP_BOY_3000_MK_V_PAGE_NAMES = [
  'Pip-Boy 3000 Mk V Apps',
  'Pip-Boy 3000 Mk V Companion App',
  'Pip-Boy 3000 Mk V Maintenance',
  'Pip-Boy 3000 Mk V Radio',
  'Pip-Boy 3000 Mk V Update',
] as const;

const FORUM_PAGE_NAMES = [
  'Forum',
  'Forum - Category',
  'Forum - New Post',
  'Forum - View Post',
] as const;

const PIP_BOY_SIMULATOR_PAGE_NAMES = [
  'Pip-Boy 2000 Mk VI Simulator',
  'Pip-Boy 3000 Mk IV Simulator',
  'Pip-Boy 3000 Simulator',
  'Pip-Boy 3000A Simulator',
] as const;

export const PAGE_NAMES = [
  'Forgot Password',
  'Home',
  'Login',
  'My Vault',
  'Page Not Found',
  'Privacy Policy',
  'Register',
  'Status',
  'Support',
  'Terms and Conditions',
  'Verify Email',
  ...FORUM_PAGE_NAMES,
  ...PIP_BOY_3000_MK_IV_PAGE_NAMES,
  ...PIP_BOY_3000_MK_V_PAGE_NAMES,
  ...PIP_BOY_SIMULATOR_PAGE_NAMES,
] as const;
