import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  templateUrl: './simulation.section.html',
  styleUrls: ['../welcome-section.scss', './simulation.section.scss'],
  imports: [PipTitleComponent],
})
export class WelcomeSimulationSection {}
