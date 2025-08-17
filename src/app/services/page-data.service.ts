import { Observable, distinctUntilChanged, filter, map, mergeMap } from 'rxjs';
import { PageData } from 'src/app/models';
import { shareSingleReplay } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class PageDataService {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly pageDataChanges: Observable<PageData | null> =
    this.router.events.pipe(
      map((event) => event instanceof NavigationEnd),
      filter((isNavigationEndEvent) => !!isNavigationEndEvent),
      map(() => this.activatedRoute),
      map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      }),
      filter((route) => route.outlet === 'primary'),
      mergeMap((route) => route.data),
      map((data) => (PageData.is(data) ? data : null)),
      distinctUntilChanged(),
      shareSingleReplay(),
    );
}
