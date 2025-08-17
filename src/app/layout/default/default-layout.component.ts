import { ContentComponent } from 'src/app/layout/content/content.component';
import { PipHeaderComponent } from 'src/app/layout/header/header.component';
import { NavbarComponent } from 'src/app/layout/navbar/navbar.component';
import { isNavbarOpenSignal } from 'src/app/signals';

import { Component, ViewChild, effect } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-default-layout',
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  imports: [
    ContentComponent,
    MatListModule,
    MatSidenavModule,
    NavbarComponent,
    PipHeaderComponent,
    RouterModule,
  ],
  standalone: true,
})
export class DefaultLayoutComponent {
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
}
