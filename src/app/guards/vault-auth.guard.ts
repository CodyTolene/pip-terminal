import { from, map, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * This guard allows access to the /vault/:id route only when:
 *  - user is logged in
 *  - route param `:id` matches the logged-in user's uid
 */
export const vaultAuthGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const idParam = route.paramMap.get('id');
  const path = route.routeConfig?.path ?? '';

  // If the URL doesn't start with `vault`, throw error as this guard
  // shouldn't be used on non vault routes. Return false.
  if (!path.startsWith('vault')) {
    console.error('[vaultAuthGuard] Route does not match vault pattern.');
    return false;
  }

  return from(auth.authReady()).pipe(
    switchMap(() => auth.userChanges.pipe(take(1))),
    map((user) => {
      if (!user) {
        // Not logged in, route home right away
        return router.createUrlTree(['/']);
      }

      if (!idParam) {
        // User is logged in, visiting `/vault`
        // Redirect `/vault` (no id) to `/vault/:uid`
        return router.createUrlTree(['/vault', user.uid]);
      }

      // Make sure id matches the users id, if not route to home
      return idParam === user.uid ? true : router.createUrlTree(['/']);
    }),
  );
};
