type PipRoute = Omit<
  import('@angular/router').Route,
  'data' | 'path' | 'redirectTo'
> & {
  path: PageUrl;
  data?: import('src/app/models').PageData;
  redirectTo?: PageUrl;
};
