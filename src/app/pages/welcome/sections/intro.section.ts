import { AppInstallService } from 'src/app/services';

import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-intro]',
  templateUrl: './intro.section.html',
  styleUrls: ['./welcome-section.scss', './intro.section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeIntroSection {
  protected readonly pwaInstall = inject(AppInstallService);

  protected readonly forumLink = forumLink;

  protected installApp(): void {
    if (!this.pwaInstall.canInstall()) {
      return;
    }

    void this.pwaInstall.promptInstall();
  }

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
