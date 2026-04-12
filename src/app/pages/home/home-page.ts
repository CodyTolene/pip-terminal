import { PipFooterComponent } from 'src/app/layout/footer/footer';
import { WelcomeCommunitySection } from 'src/app/pages/home/sections/community.section';
import { WelcomeIntroSection } from 'src/app/pages/home/sections/intro.section';
import { WelcomePipBoysSection } from 'src/app/pages/home/sections/pip-boys.section';
import { WelcomeRolesSection } from 'src/app/pages/home/sections/roles.section';

import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'pip-home-page',
  templateUrl: './home-page.html',
  imports: [
    MatIconModule,
    PipFooterComponent,
    RouterModule,
    WelcomeCommunitySection,
    WelcomeIntroSection,
    WelcomePipBoysSection,
    WelcomeRolesSection,
  ],
  styleUrl: './home-page.scss',
  standalone: true,
})
export class HomePage {}
