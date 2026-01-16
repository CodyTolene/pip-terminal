import { PageLayoutsEnum } from 'src/app/enums';

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-companions]',
  template: `
    <pip-title h2>Pip-Boy Companion Terminals</pip-title>
    <p>Select a model below to begin.</p>
    <div class="pip-grid" role="navigation" aria-label="Pip-Boy Selector">
      <a [routerLink]="[pipboy3000MkVUrl]" class="pip-grid-item terminal-card">
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img
          src="images/pip-boy/pip-boy-3000-mk-v_250x200.png"
          alt="Pip-Boy 3000 Mk V"
        />
        <h4>Pip-Boy 3000 Mk V</h4>
        <span class="device-label">Companion Application</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
      <a [routerLink]="[pipboy3000Url]" class="pip-grid-item terminal-card">
        <div class="card-overlay"></div>
        <div class="radar-pulse"></div>
        <img
          src="images/pip-boy/pip-boy-3000_TWC_250x200.png"
          alt="Pip-Boy 3000"
        />
        <h4><pip-badge>TBA</pip-badge> Pip-Boy 3000</h4>
        <span class="device-label">Companion Application</span>
        <div class="card-corners">
          <span class="corner tl"></span>
          <span class="corner tr"></span>
          <span class="corner bl"></span>
          <span class="corner br"></span>
        </div>
      </a>
    </div>
    <p class="note"><pip-badge>TBA</pip-badge> Coming soon</p>
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
        }
      }

      pip-title[h2] {
        margin-bottom: 0;
      }
    `,
  ],
})
export class WelcomeCompanionsSection {
  protected readonly PageLayoutsEnum = PageLayoutsEnum;

  protected readonly pipboy3000Url: PageUrl = '3000-companion';
  protected readonly pipboy3000MkVUrl: PageUrl = '3000-mk-v';
}
