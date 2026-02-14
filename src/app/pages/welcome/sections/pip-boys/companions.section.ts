import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadge } from 'src/app/components/badge/badge';
import { PipTitleComponent } from 'src/app/components/title/title';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-companions]',
  templateUrl: './companions.section.html',
  styleUrls: ['../welcome-section.scss', './companions.section.scss'],
  imports: [PipBadge, PipTitleComponent, RouterModule],
})
export class WelcomeCompanionsSection {
  protected readonly pipboy3000Url: PageUrl = '3000-companion';
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
