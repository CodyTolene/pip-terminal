import { Component } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipIconComponent } from 'src/app/components/icon/icon';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-donators]',
  templateUrl: './donators.section.html',
  styleUrls: ['../welcome-section.scss', './donators.section.scss'],
  imports: [
    MatTooltipModule,
    PipButtonComponent,
    PipIconComponent,
    PipTitleComponent,
    RouterModule,
  ],
})
export class WelcomeDonatorsSection {
  protected openDonatorsPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}
