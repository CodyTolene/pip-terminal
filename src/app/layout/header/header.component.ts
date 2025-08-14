import { APP_VERSION } from 'src/app/constants';
import { PAGES } from 'src/app/routing';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  imports: [CommonModule, RouterModule],
  styleUrl: './header.component.scss',
  providers: [],
  standalone: true,
})
export class PipHeaderComponent {
  protected readonly versionNumber = APP_VERSION;
  protected readonly homeUrl = PAGES['Home'];
}
