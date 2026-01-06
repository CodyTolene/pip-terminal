import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-developers]',
  template: `
    <pip-title h2>Vault-Tec Engineers</pip-title>
    <p>
      This project wouldn't be as fun as it is without the incredible developers
      who've built apps, shared ideas, and contributed code to the Pip-Boy
      ecosystem. From core tools to custom modules, every line of code helps
      bring the experience to life, thank you.
    </p>

    <div class="pip-grid" aria-label="Developers">
      <!-- rikkuness "Darrian" -->
      <a
        class="pip-grid-item"
        href="https://github.com/rikkuness"
        target="_blank"
      >
        <h4>rikkuness</h4>
        <!--
        <span>"RobCo Industries" founder</span>
        <span>Original Developer</span>
        -->
      </a>
      <!-- gfwilliams "Gordon Williams" -->
      <a
        class="pip-grid-item"
        href="https://github.com/gfwilliams"
        target="_blank"
      >
        <h4>gfwilliams</h4>
        <!--<span>Original Developer</span>-->
      </a>
      <!-- rblakesley "Richard Blakesley" -->
      <a
        class="pip-grid-item"
        href="https://github.com/rblakesley"
        target="_blank"
      >
        <h4>rblakesley</h4>
        <!--
        <span>Original Developer</span>
        <span>"Asteroid"</span>
        <span>"Custom IMG"</span>
        <span>"Custom Map"</span>
        <span>"Custom Text"</span>
        <span>"Custom alarm"</span>
        <span>"ID Card"</span>
        <span>"Settings"</span>
        -->
      </a>
      <!-- Gnargle "Athene" -->
      <a
        class="pip-grid-item"
        href="https://github.com/gnargle"
        target="_blank"
      >
        <h4>gnargle</h4>
        <!--
        <span>"PipUI+ (Theme Picker)"</span>
        <span>"Stats Display"</span>
        -->
      </a>
      <!-- MercurialPony "Mercy" -->
      <a
        class="pip-grid-item"
        href="https://github.com/MercurialPony"
        target="_blank"
      >
        <h4>MercurialPony</h4>
        <!--
        <span>"PipUI+"</span>
        -->
      </a>
      <!-- pip-4111 -->
      <a
        class="pip-grid-item"
        href="https://github.com/pip-4111"
        target="_blank"
      >
        <h4>pip-4111</h4>
        <!--
        <span>"Porta Hack"</span>
        -->
      </a>
      <!-- killes007 "k!lles" -->
      <a
        class="pip-grid-item"
        href="https://github.com/killes007"
        target="_blank"
      >
        <h4>killes007</h4>
        <!--
        <span>"AsteroPIPs"</span>
        <span>"Pip2048"</span>
        -->
      </a>
      <!-- TetrisKid48 "tetriskid" -->
      <a
        class="pip-grid-item"
        href="https://github.com/TetrisKid48"
        target="_blank"
      >
        <h4>TetrisKid48</h4>
        <!--
        <span>"Vault Breaker"</span>
        -->
      </a>
      <!-- TylerJBarlett "Homicidal Mailman" -->
      <a
        class="pip-grid-item"
        href="https://github.com/tylerjbartlett"
        target="_blank"
      >
        <h4>tylerjbartlett</h4>
        <!--
        <span>"MTG Life Counter"</span>
        -->
      </a>
      <!-- AidansLab "NightmareGoggles" -->
      <a
        class="pip-grid-item"
        href="https://github.com/AidansLab"
        target="_blank"
      >
        <h4>AidansLab</h4>
        <!--
        <span>"InventoryPatch"</span>
        <span>"CFW"</span>
        -->
      </a>
      <!-- Dougie "Dougie" -->
      <a
        class="pip-grid-item"
        href="https://github.com/Dougie-1"
        target="_blank"
      >
        <h4>Dougie</h4>
        <!--
        <span>"CFW"</span>
        -->
      </a>
    </div>

    <pip-button aria-label="Contributor Button" (click)="openAppsRepo()">
      Become A Contributor!
    </pip-button>
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
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeDevelopersSection {
  protected openAppsRepo(): void {
    window.open('https://github.com/CodyTolene/pip-boy-apps', '_blank');
  }
}
