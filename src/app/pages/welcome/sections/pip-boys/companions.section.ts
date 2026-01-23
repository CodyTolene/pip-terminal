import { PageLayoutsEnum } from 'src/app/enums';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-companions]',
  templateUrl: './companions.section.html',
  styleUrls: ['../welcome-section.scss', './companions.section.scss'],
  imports: [PipBadgeComponent, PipTitleComponent, RouterModule],
})
export class WelcomeCompanionsSection {
  protected readonly PageLayoutsEnum = PageLayoutsEnum;

  protected readonly pipboy3000Url: PageUrl = '3000-companion';
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
