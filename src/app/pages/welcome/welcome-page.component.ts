import { PipFooterComponent } from 'src/app/layout/footer/footer.component';
import { WelcomeCommunitySection } from 'src/app/pages/welcome/sections/community.section';
import { WelcomeCompanionsSection } from 'src/app/pages/welcome/sections/companions.section';
import { WelcomeIntroSection } from 'src/app/pages/welcome/sections/intro.section';
import { WelcomeOpenSourceSection } from 'src/app/pages/welcome/sections/open-source.section';
import { WelcomeSimulationSection } from 'src/app/pages/welcome/sections/simulation.section';

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
    WelcomeCommunitySection,
    WelcomeCompanionsSection,
    WelcomeIntroSection,
    WelcomeOpenSourceSection,
    WelcomeSimulationSection,
  ],
  styleUrl: './welcome-page.component.scss',
  standalone: true,
})
export class WelcomePageComponent {}
