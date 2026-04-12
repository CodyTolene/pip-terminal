import { Component } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button';
import { PipTitleComponent } from 'src/app/components/title/title';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-intro]',
  templateUrl: './intro.section.html',
  styleUrls: ['./welcome-section.scss', './intro.section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule, MatTooltip],
})
export class WelcomeIntroSection {
  protected readonly forumLink = `/${'forum' satisfies PageUrl}`;

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }

  protected openGithubRepo(): void {
    window.open('https://github.com/CodyTolene/pip-terminal', '_blank');
  }
}
