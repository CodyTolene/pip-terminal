import { distinctUntilChanged, map } from 'rxjs';
import { ScreenSizeEnum } from 'src/app/enums';
import { shareSingleReplay } from 'src/app/utilities';

import {
  BreakpointObserver,
  BreakpointState,
  Breakpoints,
} from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScreenService {
  private readonly breakpointObserver = inject(BreakpointObserver);

  public readonly screenSizeChanges = this.breakpointObserver
    .observe(Object.keys(breakpointMap))
    .pipe(
      distinctUntilChanged(),
      map((state: BreakpointState) => {
        const mapEntries = Object.entries(breakpointMap);
        for (const [breakpoint, screenSize] of mapEntries) {
          if (state.breakpoints[breakpoint]) {
            return screenSize;
          }
        }
        return ScreenSizeEnum.DESKTOP;
      }),
      shareSingleReplay(),
    );
}

const breakpointMap: Record<string, ScreenSizeEnum> = {
  [Breakpoints.XSmall]: ScreenSizeEnum.MOBILE,
  [Breakpoints.Small]: ScreenSizeEnum.TABLET,
  [Breakpoints.Medium]: ScreenSizeEnum.TABLET,
  [Breakpoints.Large]: ScreenSizeEnum.DESKTOP,
  [Breakpoints.XLarge]: ScreenSizeEnum.DESKTOP,
};
