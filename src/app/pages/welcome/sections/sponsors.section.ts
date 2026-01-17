import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-sponsors]',
  template: `
    <pip-title h2>Sponsors</pip-title>
    <p>
      Thanks to our sponsors below, Pip-Boy.com remains open to the entire
      wasteland, free to use, easy to access, and built for everyone who dreams
      of gearing up with a Pip-Boy. We're grateful for the support that keeps
      this project alive:
    </p>

    <div class="pip-grid" aria-label="Sponsors">
      <!-- Theeohn (https://github.com/Theeohn) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://youtube.com/@theeohnm?si=ELPEw76GxJQgJgWE"
        target="_blank"
      >
        <div class="double-img-container">
          <img
            class="sponsor"
            src="images/sponsors/theeohn_megistus_no_glasses_250x250.png"
            alt="Theeohn"
          />
          <img
            class="sponsor-overlay-scroll-in-top"
            src="images/sponsors/theeohn_megistus_glasses_250x250.png"
            alt="Theeohn Glasses"
          />
        </div>
        <h4>Theeohn</h4>
        <span>$25 / month</span>
      </a>
      <!-- Sparercard (https://github.com/Sparercard) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://github.com/Sparercard"
        target="_blank"
      >
        <img
          class="sponsor"
          src="images/sponsors/sparercard_250x250.jpg"
          alt="Sparercard"
        />
        <h4>Sparercard</h4>
        <span>$25 / month</span>
      </a>
      <!-- Eckserah (https://github.com/eckserah) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://fallout.wiki/"
        target="_blank"
      >
        <img
          class="sponsor"
          src="images/sponsors/eckserah_birdstion_250x250.png"
          alt="Eckserah"
        />
        <h4>Eckserah</h4>
        <span>$20 / month</span>
      </a>
      <!-- S15 Costuming (https://github.com/S15Costuming) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://linktr.ee/S15Costuming"
        target="_blank"
      >
        <div class="double-img-container">
          <img
            class="sponsor"
            src="images/sponsors/s15_costuming_250x250.jpeg"
            alt="S15 Costuming"
          />
          <img
            class="sponsor-overlay"
            src="images/sponsors/s15_costuming_plate_250x250.png"
            alt="S15 Costuming Plate"
          />
        </div>
        <h4>S15 Costuming</h4>
        <span>$5 / month</span>
      </a>
      <!-- BeanutPudder (https://github.com/BeanutPudder) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://github.com/BeanutPudder"
        target="_blank"
      >
        <img
          class="sponsor"
          src="images/sponsors/beanut_pudder_250x250.jpg"
          alt="BeanutPudder"
        />
        <h4>BeanutPudder</h4>
        <span>$5 / month</span>
      </a>
      <!-- Crashrek (https://github.com/RioRocketMan) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://www.instagram.com/slainpublic?igsh=MXAxaW42b3FkNmp0eA=="
        target="_blank"
      >
        <img
          class="sponsor"
          src="images/sponsors/rio_padilla_250x250.jpg"
          alt="Rio Padilla"
        />
        <h4>Rio Padilla</h4>
        <span>$5 / month</span>
      </a>
      <!-- Jim D. (https://github.com/JLDenson) -->
      <a
        class="pip-grid-item sponsor-item"
        href="https://www.youtube.com/@jamesdenson4730"
        target="_blank"
      >
        <img
          class="sponsor"
          src="images/sponsors/jim_d_250x250.jpg"
          alt="Jim D."
        />
        <h4>Jim D.</h4>
        <span>$5 / month</span>
      </a>
    </div>

    <pip-button aria-label="Sponsor Button" (click)="openSponsorPage()">
      Become a sponsor!
    </pip-button>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeSponsorsSection {
  protected openSponsorPage(): void {
    window.open('https://github.com/sponsors/CodyTolene', '_blank');
  }
}
