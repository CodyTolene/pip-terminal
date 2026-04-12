import { APP_VERSION } from 'src/app/constants';
import { StripInlineStylesDirective } from 'src/app/directives';
import { NavList } from 'src/app/layout/navigation/nav-list';
import { isNavbarOpenSignal } from 'src/app/signals';

import { Component, ViewChild, effect } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-sidenav',
  templateUrl: './sidenav.html',
  styleUrls: ['./sidenav.scss'],
  imports: [
    MatListModule,
    MatSidenavModule,
    NavList,
    RouterModule,
    StripInlineStylesDirective,
  ],
  standalone: true,
})
export class Sidenav {
  public constructor() {
    effect(() => {
      const isNavbarOpen = isNavbarOpenSignal();
      if (isNavbarOpen) {
        this.navbar?.open();
      } else {
        this.navbar?.close();
      }
    });
  }

  @ViewChild('navbar') private readonly navbar: MatSidenav | null = null;

  protected readonly isNavbarOpenSignal = isNavbarOpenSignal;

  protected readonly versionNumber = APP_VERSION;

  protected closeNavbar(): void {
    isNavbarOpenSignal.set(false);
  }
}
