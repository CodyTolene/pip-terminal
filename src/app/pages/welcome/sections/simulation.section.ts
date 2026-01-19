import { environment } from 'src/environments/environment';

import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  templateUrl: './simulation.section.html',
  styleUrls: ['./welcome-section.scss', './simulation.section.scss'],
  imports: [PipTitleComponent],
})
export class WelcomeSimulationSection {
  private readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  protected readonly simulationUrl = 'https://pip-terminal.com/';

  protected trackSimulationClick(): void {
    if (!this.analytics) {
      return;
    }

    logEvent(this.analytics, 'open_simulation_terminals', {
      from: 'pip-boy.com',
      to: 'pip-terminal.com',
    });
  }
}
