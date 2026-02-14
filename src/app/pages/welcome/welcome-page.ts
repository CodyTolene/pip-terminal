import { PipFooterComponent } from 'src/app/layout/footer/footer';
import { WelcomeCommunitySection } from 'src/app/pages/welcome/sections/community.section';
import { WelcomeIntroSection } from 'src/app/pages/welcome/sections/intro.section';
import { WelcomeOpenSourceSection } from 'src/app/pages/welcome/sections/open-source.section';
import { WelcomeCompanionsSection } from 'src/app/pages/welcome/sections/pip-boys/companions.section';
import { WelcomeSimulationSection } from 'src/app/pages/welcome/sections/pip-boys/simulation.section';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { PipDivider } from 'src/app/components/divider/divider';
import { PipNotice } from 'src/app/components/notice/notice';

@Component({
  selector: 'pip-welcome-page',
  templateUrl: './welcome-page.html',
  imports: [
    MatIconModule,
    PipDivider,
    PipFooterComponent,
    PipNotice,
    RouterModule,
    WelcomeCommunitySection,
    WelcomeCompanionsSection,
    WelcomeIntroSection,
    WelcomeOpenSourceSection,
    WelcomeSimulationSection,
  ],
  styleUrl: './welcome-page.scss',
  standalone: true,
})
export class WelcomePage {}
