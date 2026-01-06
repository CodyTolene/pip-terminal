import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-support]',
  template: `
    <pip-title h2>Vault-Tec Support</pip-title>
    <p>
      A huge thanks to the support crew and everyone active in the Discord
      channel. From testing features to sharing feedback, reporting bugs, and
      helping others, your contributions help shape the direction of the project
      and keep the community thriving.
    </p>

    <div class="pip-grid" aria-label="Support Team">
      <!-- Forgone.Z -->
      <a
        class="pip-grid-item"
        href="https://linktr.ee/Forgone.Z"
        target="_blank"
      >
        <h4>Forgone.Z</h4>
      </a>
      <!-- beaverboy-12 "Azrael" -->
      <a
        class="pip-grid-item"
        href="https://github.com/beaverboy-12"
        target="_blank"
      >
        <h4>beaverboy-12</h4>
      </a>
      <!-- Matchwood  -->
      <!-- Currently no link per request -->
      <a class="pip-grid-item" href>
        <h4>Matchwood</h4>
      </a>
    </div>
  `,
  styleUrls: ['./welcome-section.scss'],
  styles: [
    `
      :host {
        margin-top: 2rem;

        a > h4 {
          margin: 0;
        }
      }
    `,
  ],
  imports: [PipTitleComponent, RouterModule],
})
export class WelcomeSupportSection {}
