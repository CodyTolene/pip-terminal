import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipIconComponent } from 'src/app/components/icon/icon';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-developers]',
  templateUrl: './developers.section.html',
  styleUrls: ['../welcome-section.scss', './developers.section.scss'],
  imports: [
    PipButtonComponent,
    PipIconComponent,
    PipTitleComponent,
    RouterModule,
  ],
})
export class WelcomeDevelopersSection {
  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }
}
