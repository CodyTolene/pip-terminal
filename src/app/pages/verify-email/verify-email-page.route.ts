import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { isLoggedInGuard } from 'src/app/guards';

export const VERIFY_EMAIL_PAGE_ROUTE: PipRoute = {
  path: 'verify-email',
  pathMatch: 'full',
  canActivate: [isLoggedInGuard],
  data: {
    author: META_AUTHOR,
    description: 'Verify your email address to continue using the app.',
    keywords: ['Verify Email', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Verify Email',
  },
  loadComponent: () =>
    import('src/app/pages').then((c) => c.VerifyEmailPageComponent),
};
