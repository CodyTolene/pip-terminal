import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-companions]',
  templateUrl: './companions.section.html',
  styleUrls: ['../welcome-section.scss', './companions.section.scss'],
  imports: [PipTitleComponent, RouterModule],
})
export class WelcomeCompanionsSection {
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
