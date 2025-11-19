import { PageLayoutsEnum } from 'src/app/enums';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  template: `
    <pip-title h2>Simulation Terminals</pip-title>
    <p>Select a model below to begin.</p>
    <div class="pip-grid" role="navigation" aria-label="Pip-Boy Selector">
      <a [routerLink]="[PageLayoutsEnum.PIP_2000_MK_VI]" class="pip-grid-item">
        <img
          src="images/pip-boy/pip-boy-2000-mk-vi_250x200.png"
          alt="Pip-Boy 2000 Mk VI"
        />
        <h4>Pip-Boy 2000 Mk VI*</h4>
        <span>Device Simulator</span>
      </a>
      <a [routerLink]="[PageLayoutsEnum.PIP_3000_MK_IV]" class="pip-grid-item">
        <img
          src="images/pip-boy/pip-boy-3000-mk-iv_250x200.png"
          alt="Pip-Boy 3000 Mk IV"
        />
        <h4>Pip-Boy 3000 Mk IV**</h4>
        <span>Device Simulator</span>
      </a>
      <a [routerLink]="[PageLayoutsEnum.PIP_3000A]" class="pip-grid-item">
        <img
          src="images/pip-boy/pip-boy-3000A_250x200.png"
          alt="Pip-Boy 3000A"
        />
        <h4>Pip-Boy 3000A*</h4>
        <span>Device Simulator</span>
      </a>
      <a [routerLink]="[PageLayoutsEnum.PIP_3000]" class="pip-grid-item">
        <img src="images/pip-boy/pip-boy-3000_250x200.png" alt="Pip-Boy 3000" />
        <h4>Pip-Boy 3000*</h4>
        <span>Device Simulator</span>
      </a>
    </div>
    <p class="note">
      <strong>*Coming soon</strong>
      <strong>**Partially Completed</strong>
    </p>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipTitleComponent, RouterModule],
  styles: [
    `
      @use '../../../styles/variables' as var;
      :host {
        .pip-grid {
          margin-bottom: 2rem;
        }

        p.note {
          font-size: var.$font-xxs;
          margin: 0 0 2rem 0;

          strong {
            display: block;
            margin-bottom: 0.5rem;
          }
        }
      }

      pip-title[h2] {
        margin-top: 1rem;
        margin-bottom: 0;
      }
    `,
  ],
})
export class WelcomeSimulationSection {
  protected readonly PageLayoutsEnum = PageLayoutsEnum;

  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
