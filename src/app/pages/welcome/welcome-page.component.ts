import { APP_VERSION } from 'src/app/constants';
import { PipUrlsEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [CommonModule, MatIconModule, PipButtonComponent, RouterModule],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {
  protected readonly PipUrlsEnum = PipUrlsEnum;

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
