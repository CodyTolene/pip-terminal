import { APP_VERSION } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { PipFooterComponent } from 'src/app/layout/footer/footer.component';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipDividerComponent } from 'src/app/components/divider/divider.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [
    MatIconModule,
    PipBadgeComponent,
    PipButtonComponent,
    PipDividerComponent,
    PipFooterComponent,
    PipPanelComponent,
    PipTitleComponent,
    RouterModule,
  ],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {
  protected readonly PageLayoutsEnum = PageLayoutsEnum;

  protected readonly forumLink = forumLink;
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
  protected readonly versionNumber = APP_VERSION;

  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }

  protected openSponsorPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
