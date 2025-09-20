import { APP_VERSION } from 'src/app/constants';

import { Component } from '@angular/core';

import { ThemeSelectorComponent } from 'src/app/components/theme-selector/theme-selector.component';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  imports: [ThemeSelectorComponent],
  styleUrl: './footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {
  protected readonly versionNumber = APP_VERSION;
}
