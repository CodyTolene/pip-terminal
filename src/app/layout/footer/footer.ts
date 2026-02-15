import { APP_VERSION } from 'src/app/constants';

import { Component } from '@angular/core';

import { ThemeSelectorComponent } from 'src/app/components/theme-selector/theme-selector';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.html',
  imports: [ThemeSelectorComponent],
  styleUrl: './footer.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {
  protected readonly versionNumber = APP_VERSION;
}
