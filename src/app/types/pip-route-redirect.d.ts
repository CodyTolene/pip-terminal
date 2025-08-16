type PipRouteRedirect = Omit<PipRoute, 'data' | 'path'> & {
  path: string;
};
