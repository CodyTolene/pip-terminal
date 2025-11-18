import { PipFooterComponent } from 'src/app/layout/footer/footer.component';
import { WelcomeDevelopersSection } from 'src/app/pages/welcome/sections/developers.section';
import { WelcomeForumSection } from 'src/app/pages/welcome/sections/forum.section';
import { WelcomeIntroSection } from 'src/app/pages/welcome/sections/intro.section';
import { WelcomeNoticeSection } from 'src/app/pages/welcome/sections/notice.section';
import { WelcomeOpenSourceSection } from 'src/app/pages/welcome/sections/open-source.section';
import { WelcomeSimulationSection } from 'src/app/pages/welcome/sections/simulation.section';
import { WelcomeSponsorsSection } from 'src/app/pages/welcome/sections/sponsors.section';
import { WelcomeSupportSection } from 'src/app/pages/welcome/sections/support.section';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipDividerComponent } from 'src/app/components/divider/divider.component';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.component.html',
  imports: [
    MatIconModule,
    PipDividerComponent,
    PipFooterComponent,
    RouterModule,
    WelcomeDevelopersSection,
    WelcomeForumSection,
    WelcomeIntroSection,
    WelcomeNoticeSection,
    WelcomeOpenSourceSection,
    WelcomeSimulationSection,
    WelcomeSponsorsSection,
    WelcomeSupportSection,
  ],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {}
