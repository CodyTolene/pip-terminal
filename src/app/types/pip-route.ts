import { PageUrl } from 'src/app/types/page-url';

export type PipRoute = Omit<
  import('@angular/router').Route,
  'data' | 'path' | 'redirectTo'
> & {
  path: PageUrl;
  data?: import('src/app/models').PageData;
  redirectTo?: PageUrl;
};
