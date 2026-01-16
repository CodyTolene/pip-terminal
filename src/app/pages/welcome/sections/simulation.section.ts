import { PageLayoutsEnum } from 'src/app/enums';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  template: `
    <pip-title h2>Simulation Terminals</pip-title>
    <p>Select a model below to begin.</p>
    <div class="pip-grid" role="navigation" aria-label="Pip-Boy Selector">
      <a
        [routerLink]="[PageLayoutsEnum.PIP_3000_MK_IV]"
        class="pip-grid-item terminal-card"
      >
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img
          src="images/pip-boy/pip-boy-3000-mk-iv_250x200.png"
          alt="Pip-Boy 3000 Mk IV"
        />
        <h4><pip-badge>WIP</pip-badge> Pip-Boy 3000 Mk IV</h4>
        <span class="device-label">Device Simulator</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
      <a
        [routerLink]="[PageLayoutsEnum.PIP_3000]"
        class="pip-grid-item terminal-card"
      >
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img src="images/pip-boy/pip-boy-3000_250x200.png" alt="Pip-Boy 3000" />
        <h4><pip-badge>WIP</pip-badge> Pip-Boy 3000</h4>
        <span class="device-label">Device Simulator</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
      <a
        [routerLink]="[PageLayoutsEnum.PIP_3000A]"
        class="pip-grid-item terminal-card"
      >
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img
          src="images/pip-boy/pip-boy-3000A_250x200.png"
          alt="Pip-Boy 3000A"
        />
        <h4><pip-badge>TBA</pip-badge> Pip-Boy 3000A</h4>
        <span class="device-label">Device Simulator</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
      <a
        [routerLink]="[PageLayoutsEnum.PIP_2000_MK_VI]"
        class="pip-grid-item terminal-card"
      >
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img
          src="images/pip-boy/pip-boy-2000-mk-vi_250x200.png"
          alt="Pip-Boy 2000 Mk VI"
        />
        <h4><pip-badge>TBA</pip-badge> Pip-Boy 2000 Mk VI</h4>
        <span class="device-label">Device Simulator</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
    </div>
    <p class="note">
      <span class="note-item"><pip-badge>TBA</pip-badge> Coming soon</span>
      <span class="note-item"><pip-badge>WIP</pip-badge> Work in progress</span>
    </p>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipBadgeComponent, PipTitleComponent, RouterModule],
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

          .note-item {
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
