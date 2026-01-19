import { Component } from '@angular/core';

import { PipIconComponent } from 'src/app/components/icon/icon.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-support]',
  templateUrl: './support.section.html',
  styleUrls: ['./welcome-section.scss', './support.section.scss'],
  imports: [PipIconComponent, PipTitleComponent],
})
export class WelcomeSupportSection {}
