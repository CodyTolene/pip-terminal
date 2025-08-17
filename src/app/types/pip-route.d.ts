type PipRoute = Omit<import('@angular/router').Route, 'data' | 'path'> & {
  data?: import('src/app/models').PageData;
  path: PageUrl;
};
