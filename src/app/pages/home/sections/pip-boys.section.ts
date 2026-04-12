import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-pip-boys]',
  templateUrl: './pip-boys.section.html',
  styleUrls: ['./welcome-section.scss', './pip-boys.section.scss'],
  imports: [RouterModule],
})
export class WelcomePipBoysSection {
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
