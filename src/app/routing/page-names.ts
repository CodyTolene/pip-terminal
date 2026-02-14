const FORUM_PAGE_NAMES = [
  'Forum - Category',
  'Forum - New Post',
  'Forum - View Post',
  'Forum',
] as const;

const PIP_BOY_3000_COMPANION_PAGE_NAMES = [
  'Pip-Boy 3000 Companion Terminal',
] as const;

const PIP_BOY_3000_MK_V_PAGE_NAMES = [
  'Pip-Boy 3000 Mk V Apps',
  'Pip-Boy 3000 Mk V CFW Builder',
  'Pip-Boy 3000 Mk V Companion Terminal',
  'Pip-Boy 3000 Mk V File Management',
  'Pip-Boy 3000 Mk V Maintenance',
  'Pip-Boy 3000 Mk V Radio',
  'Pip-Boy 3000 Mk V Update',
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
  'Resources',
  'Status',
  'Support',
  'Terms and Conditions',
  'Verify Email',
  ...FORUM_PAGE_NAMES,
  ...PIP_BOY_3000_COMPANION_PAGE_NAMES,
  ...PIP_BOY_3000_MK_V_PAGE_NAMES,
  ...PIP_BOY_SIMULATOR_PAGE_NAMES,
] as const;
