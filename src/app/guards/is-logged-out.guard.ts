import { from, map, switchMap, take } from 'rxjs';
import { AuthService } from 'src/app/services';

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

export const isLoggedOutGuard: CanActivateFn = (_route) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return from(auth.authReady()).pipe(
    switchMap(() => auth.userChanges.pipe(take(1))),
    map((user) => {
      if (user) {
        // User is logged in, redirect home
        return router.createUrlTree(['' satisfies PageUrl]);
      }

      return true;
    }),
  );
};
