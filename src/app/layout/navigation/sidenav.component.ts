import { NavListComponent } from 'src/app/layout/navigation/nav-list.component';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, effect } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  imports: [
    CommonModule,
    MatListModule,
    MatSidenavModule,
    NavListComponent,
    RouterModule,
  ],
  standalone: true,
})
export class SidenavComponent {
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

  protected closeNavbar(): void {
    isNavbarOpenSignal.set(false);
  }
}
