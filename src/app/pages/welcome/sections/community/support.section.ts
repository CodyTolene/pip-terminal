import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipIconComponent } from 'src/app/components/icon/icon';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-support]',
  templateUrl: './support.section.html',
  styleUrls: ['../welcome-section.scss', './support.section.scss'],
  imports: [PipButtonComponent, PipIconComponent, PipTitleComponent],
})
export class WelcomeSupportSection {
  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}
