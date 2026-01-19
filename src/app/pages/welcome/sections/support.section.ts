import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-support]',
  templateUrl: './support.section.html',
  styleUrls: ['./welcome-section.scss', './support.section.scss'],
  imports: [PipTitleComponent, RouterModule],
})
export class WelcomeSupportSection {}
