import { APP_VERSION } from 'src/app/constants';
import { PageLayoutsEnum } from 'src/app/enums';
import { PipFooterComponent } from 'src/app/layout/footer/footer.component';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [
    MatIconModule,
    PipButtonComponent,
    PipFooterComponent,
    RouterModule,
  ],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {
  protected readonly PageLayoutsEnum = PageLayoutsEnum;

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
