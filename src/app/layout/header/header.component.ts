import { APP_VERSION } from 'src/app/constants';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-header',
  templateUrl: './header.component.html',
  imports: [CommonModule],
  styleUrl: './header.component.scss',
  providers: [],
  standalone: true,
})
export class PipHeaderComponent {
  protected readonly versionNumber = APP_VERSION;
}
