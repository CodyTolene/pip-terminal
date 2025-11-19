import { PipFooterComponent } from 'src/app/layout/footer/footer.component';
import { WelcomeCompanionsSection } from 'src/app/pages/welcome/sections/companions.section';
import { WelcomeDevelopersSection } from 'src/app/pages/welcome/sections/developers.section';
import { WelcomeIntroSection } from 'src/app/pages/welcome/sections/intro.section';
import { WelcomeOpenSourceSection } from 'src/app/pages/welcome/sections/open-source.section';
import { WelcomeSimulationSection } from 'src/app/pages/welcome/sections/simulation.section';
import { WelcomeSponsorsSection } from 'src/app/pages/welcome/sections/sponsors.section';
import { WelcomeSupportSection } from 'src/app/pages/welcome/sections/support.section';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipDividerComponent } from 'src/app/components/divider/divider.component';
import { PipNoticeComponent } from 'src/app/components/notice/notice.component';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [
    MatIconModule,
    PipDividerComponent,
    PipFooterComponent,
    PipNoticeComponent,
    RouterModule,
    WelcomeCompanionsSection,
    WelcomeDevelopersSection,
    WelcomeIntroSection,
    WelcomeOpenSourceSection,
    WelcomeSimulationSection,
    WelcomeSponsorsSection,
    WelcomeSupportSection,
  ],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {}
