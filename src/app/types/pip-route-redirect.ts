import { PipRoute } from 'src/app/types/pip-route';

export type PipRouteRedirect = Omit<PipRoute, 'data' | 'path'> & {
  path: string;
};
