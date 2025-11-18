import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-open-source]',
  template: `
    <pip-title h2>Open-Source</pip-title>
    <p>
      This project is open-source and welcome to contributions from vault
      dwellers around the world! Explore the code, suggest features, or report
      issues on GitHub.
    </p>

    <pip-button
      aria-label="Visit the Pip-Boy.com GitHub Repository"
      (click)="openGitHubRepo()"
    >
      View Pip-Boy.com on GitHub
    </pip-button>

    <pip-button
      aria-label="Visit the Community Apps GitHub Repository"
      (click)="openAppsRepo()"
    >
      View Community Apps on GitHub
    </pip-button>
  `,
  styleUrls: ['./welcome-section.scss'],
  styles: [
    `
      @use '../../../styles/variables' as var;
      :host {
        margin-top: 1rem;
      }
      pip-button {
        margin: 1rem auto;
        max-width: var.$section-max-width;
      }
    `,
  ],
  imports: [PipButtonComponent, PipTitleComponent],
})
export class WelcomeOpenSourceSection {
  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }

  protected openGitHubRepo(): void {
    window.open('https://github.com/CodyTolene/pip-terminal', '_blank');
  }
}
