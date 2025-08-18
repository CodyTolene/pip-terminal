import { APP_VERSION } from 'src/app/constants';

import { Component } from '@angular/core';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  imports: [],
  styleUrl: './footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {
  protected readonly versionNumber = APP_VERSION;
}
