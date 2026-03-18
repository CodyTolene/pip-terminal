import { WelcomeBoostersSection } from 'src/app/pages/welcome/sections/community/boosters.section';
import { WelcomeDevelopersSection } from 'src/app/pages/welcome/sections/community/developers.section';
import { WelcomeDonatorsSection } from 'src/app/pages/welcome/sections/community/donators.section';
import { WelcomeSupportSection } from 'src/app/pages/welcome/sections/community/support.section';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipPanelComponent } from 'src/app/components/panel/panel';
import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-community]',
  templateUrl: './community.section.html',
  styleUrls: ['./welcome-section.scss', './community.section.scss'],
  imports: [
    PipPanelComponent,
    PipTitleComponent,
    RouterModule,
    WelcomeDevelopersSection,
    WelcomeBoostersSection,
    WelcomeDonatorsSection,
    WelcomeSupportSection,
  ],
})
export class WelcomeCommunitySection {
  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }

  protected openGitHubPage(): void {
    window.open('https://github.com/CodyTolene/pip-terminal', '_blank');
  }

  protected openSponsorPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}
