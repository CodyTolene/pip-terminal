import { PAGES } from 'src/app/routing';
import { isNavbarOpenSignal } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, MatIconModule, MatTooltipModule, RouterModule],
  styleUrl: './header.component.scss',
  providers: [],
  standalone: true,
})
export class PipHeaderComponent {
  protected readonly homeUrl = PAGES['Home'];
  protected readonly isNavbarOpenSignal = isNavbarOpenSignal;

  protected toggleNavbar(): void {
    this.isNavbarOpenSignal.set(!this.isNavbarOpenSignal());
  }
}
