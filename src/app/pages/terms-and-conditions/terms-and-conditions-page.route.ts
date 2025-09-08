import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

import { PipRoute } from 'src/app/types/pip-route';

export const TERMS_AND_CONDITIONS_PAGE_ROUTE: PipRoute = {
  path: 'terms-and-conditions',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'View the terms and conditions of Pip-Boy.com.',
    keywords: ['Terms', 'Conditions', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Terms and Conditions',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.TermsAndConditionsPageComponent),
};
