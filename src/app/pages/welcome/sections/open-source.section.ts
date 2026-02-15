import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-open-source]',
  templateUrl: './open-source.section.html',
  styleUrls: ['./welcome-section.scss', './open-source.section.scss'],
  imports: [PipButtonComponent, PipTitleComponent],
})
export class WelcomeOpenSourceSection {
  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }

  protected openGitHubRepo(): void {
    window.open('https://github.com/CodyTolene/pip-terminal', '_blank');
  }
}
