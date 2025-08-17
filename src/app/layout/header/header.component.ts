import { PAGES } from 'src/app/routing';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIconModule, RouterModule],
  styleUrl: './header.component.scss',
  providers: [],
  standalone: true,
})
export class HeaderComponent {
  protected readonly homeUrl = PAGES['Home'];
  protected readonly isNavbarOpenSignal = isNavbarOpenSignal;

  @Input({ required: false })
  public cursorSide: CursorSide = 'right';

  protected toggleNavbar(): void {
    this.isNavbarOpenSignal.set(!this.isNavbarOpenSignal());
  }
}

type CursorSide = 'left' | 'right';
