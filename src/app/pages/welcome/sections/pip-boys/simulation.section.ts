import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadge } from 'src/app/components/badge/badge';
import { PipTitleComponent } from 'src/app/components/title/title';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  templateUrl: './simulation.section.html',
  styleUrls: ['../welcome-section.scss', './simulation.section.scss'],
  imports: [PipBadge, PipTitleComponent, RouterModule],
})
export class WelcomeSimulationSection {
  protected readonly pipBoy3000Url: PageUrl = '3000';
  protected readonly pipBoy3000aUrl: PageUrl = '3000a';
}
