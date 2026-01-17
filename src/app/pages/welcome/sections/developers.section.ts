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
      <div class="pip-grid-item">
        <h4>rikkuness</h4>
        <div class="social-links">
          <a href="https://github.com/rikkuness" target="_blank" aria-label="rikkuness GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
          <a href="https://log.robco-industries.org/" target="_blank" aria-label="rikkuness Website" title="Website">
            <img src="/images/devs/website.svg" alt="Website" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- gfwilliams "Gordon Williams" -->
      <div class="pip-grid-item">
        <h4>gfwilliams</h4>
        <div class="social-links">
          <a href="https://github.com/gfwilliams" target="_blank" aria-label="gfwilliams GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
          <a href="https://www.pur3.co.uk/" target="_blank" aria-label="gfwilliams Website" title="Website">
            <img src="/images/devs/website.svg" alt="Website" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- rblakesley "Richard Blakesley" -->
      <div class="pip-grid-item">
        <h4>rblakesley</h4>
        <div class="social-links">
          <a href="https://github.com/rblakesley" target="_blank" aria-label="rblakesley GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- AidansLab "NightmareGoggles" -->
      <div class="pip-grid-item">
        <h4>AidansLab</h4>
        <div class="social-links">
          <a href="https://github.com/AidansLab" target="_blank" aria-label="AidansLab GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
          <a href="https://www.youtube.com/@Aidans_Lab" target="_blank" aria-label="AidansLab YouTube" title="YouTube">
            <img src="/images/devs/youtube.svg" alt="YouTube" width="24" height="24" />
          </a>
          <a href="https://aidanslab.github.io/" target="_blank" aria-label="AidansLab Website" title="Website">
            <img src="/images/devs/website.svg" alt="Website" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- Gnargle "Athene" -->
      <div class="pip-grid-item">
        <h4>gnargle</h4>
        <div class="social-links">
          <a href="https://github.com/gnargle" target="_blank" aria-label="gnargle GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- MercurialPony "Mercy" -->
      <div class="pip-grid-item">
        <h4>MercurialPony</h4>
        <div class="social-links">
          <a href="https://github.com/MercurialPony" target="_blank" aria-label="MercurialPony GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- pip-4111 -->
      <div class="pip-grid-item">
        <h4>pip-4111</h4>
        <div class="social-links">
          <a href="https://github.com/pip-4111" target="_blank" aria-label="pip-4111 GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- killes007 "k!lles" -->
      <div class="pip-grid-item">
        <h4>killes007</h4>
        <div class="social-links">
          <a href="https://github.com/killes007" target="_blank" aria-label="killes007 GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- TetrisKid48 "tetriskid" -->
      <div class="pip-grid-item">
        <h4>TetrisKid48</h4>
        <div class="social-links">
          <a href="https://github.com/TetrisKid48" target="_blank" aria-label="TetrisKid48 GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
          <a href="https://tetriskid48.github.io/" target="_blank" aria-label="TetrisKid48 Website" title="Website">
            <img src="/images/devs/website.svg" alt="Website" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- TylerJBarlett "Homicidal Mailman" -->
      <div class="pip-grid-item">
        <h4>tylerjbartlett</h4>
        <div class="social-links">
          <a href="https://github.com/tylerjbartlett" target="_blank" aria-label="tylerjbartlett GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
      <!-- Dougie "Dougie" -->
      <div class="pip-grid-item">
        <h4>Dougie</h4>
        <div class="social-links">
          <a href="https://github.com/Dougie-1" target="_blank" aria-label="Dougie GitHub" title="GitHub">
            <img src="/images/devs/github.svg" alt="GitHub" width="24" height="24" />
          </a>
        </div>
      </div>
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

        .pip-grid-item.pip-grid-item {
          .social-links {
            display: flex;
            gap: 0.4rem;
            margin-top: 0.5rem;
            justify-content: center;
            position: relative;
            z-index: 10;

            a {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 0.3rem;
              border-radius: 4px;
              transition: all 0.2s ease;
              cursor: pointer;
              position: relative;
              z-index: 10;

              img {
                width: 28px;
                height: 28px;
                pointer-events: none;
              }

              &:hover {
                transform: scale(1.2);
                filter: brightness(1.3);
              }
            }
          }
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
