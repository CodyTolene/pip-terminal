import { SLUG_TO_CATEGORY } from 'src/app/routing';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';
import { RouteResourceId } from 'src/app/types/route-resource-id';

export const isForumCategoryGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  const routeId = (':id' satisfies RouteResourceId).slice(1);
  const raw = route.paramMap.get(routeId)?.toLowerCase() ?? '';
  const isValid = raw in SLUG_TO_CATEGORY;

  if (isValid) {
    return true;
  }

  const fallbackUrl: PageUrl = 'forum';
  return router.createUrlTree([fallbackUrl]);
};
