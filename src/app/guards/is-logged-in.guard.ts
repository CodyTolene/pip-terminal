import { from, map, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const isLoggedInGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return from(auth.authReady()).pipe(
    switchMap(() => auth.userChanges.pipe(take(1))),
    map((user) => {
      if (!user) {
        // Not logged in, redirect home
        return router.createUrlTree(['' satisfies PageUrl]);
      }

      if (!user.emailVerified) {
        const requestedRoute = route.routeConfig?.path;
        if (requestedRoute === ('verify-email' satisfies PageUrl)) {
          // Already on the verify email page, do nothing
          return true;
        } else {
          // Email not verified, redirect to verify email page
          return router.createUrlTree(['verify-email' satisfies PageUrl]);
        }
      }

      return true;
    }),
  );
};
