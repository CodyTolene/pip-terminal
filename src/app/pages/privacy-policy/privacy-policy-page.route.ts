import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';

import { PipRoute } from 'src/app/types/pip-route';

export const PRIVACY_POLICY_PAGE_ROUTE: PipRoute = {
  path: 'privacy-policy',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'View the privacy policy of Pip-Boy.com.',
    keywords: ['Privacy Policy', ...META_DEFAULT_KEYWORDS],
    title: 'Privacy Policy',
  },
  loadComponent: () => import('src/app/pages').then((c) => c.PrivacyPolicyPage),
};
