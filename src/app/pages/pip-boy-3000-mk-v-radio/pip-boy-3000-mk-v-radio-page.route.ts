import { META_AUTHOR, META_DEFAULT_KEYWORDS } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';

export const PIP_BOY_3000_MK_V_RADIO_PAGE_ROUTE: PipRoute = {
  path: '3000-mk-v/radio',
  pathMatch: 'full',
  data: {
    author: META_AUTHOR,
    description: 'Customize your Pip-Boy 3000 Mk V Radio!',
    keywords: ['Pip-Boy 3000 Mk V', 'Radio', ...META_DEFAULT_KEYWORDS],
    layout: PageLayoutsEnum.NONE,
    title: 'Pip-Boy 3000 Mk V Radio',
  },
  children: [
    {
      path: '',
      loadComponent: () =>
        import('src/app/pages').then((c) => c.PipBoy3000MkVRadioPageComponent),
    },
  ],
};
