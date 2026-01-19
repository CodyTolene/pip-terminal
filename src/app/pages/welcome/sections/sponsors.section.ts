import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-sponsors]',
  templateUrl: './sponsors.section.html',
  styleUrls: ['./welcome-section.scss', './sponsors.section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeSponsorsSection {
  protected openSponsorPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}
