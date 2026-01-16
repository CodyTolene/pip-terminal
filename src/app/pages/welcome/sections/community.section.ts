import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-community]',
  template: `
    <pip-title h2>Community Support</pip-title>
    <p>
      Huge thanks to these community members for feedback, bug reports, ideas,
      and helping shape Pip-Boy.com.
    </p>
    <div class="pip-grid" aria-label="Community Support">
      <a
        class="pip-grid-item community-item"
        href="https://youtube.com/@theeohnm?si=ELPEw76GxJQgJgWE"
        target="_blank"
      >
        <div class="double-img-container">
          <img
            class="community"
            src="images/community/theeohn_megistus_no_glasses_250x250.png"
            alt="Theeohn"
          />
          <img
            class="community-overlay-scroll-in-top"
            src="images/community/theeohn_megistus_glasses_250x250.png"
            alt="Theeohn Glasses"
          />
        </div>
        <h4>Theeohn</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://github.com/Sparercard"
        target="_blank"
      >
        <img
          class="community"
          src="images/community/sparercard_250x250.jpg"
          alt="Sparercard"
        />
        <h4>Sparercard</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://fallout.wiki/"
        target="_blank"
      >
        <img
          class="community"
          src="images/community/eckserah_birdstion_250x250.png"
          alt="Eckserah"
        />
        <h4>Eckserah</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://linktr.ee/S15Costuming"
        target="_blank"
      >
        <div class="double-img-container">
          <img
            class="community"
            src="images/community/s15_costuming_250x250.jpeg"
            alt="S15 Costuming"
          />
          <img
            class="community-overlay"
            src="images/community/s15_costuming_plate_250x250.png"
            alt="S15 Costuming Plate"
          />
        </div>
        <h4>S15 Costuming</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://github.com/BeanutPudder"
        target="_blank"
      >
        <img
          class="community"
          src="images/community/beanut_pudder_250x250.jpg"
          alt="BeanutPudder"
        />
        <h4>BeanutPudder</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://www.instagram.com/slainpublic?igsh=MXAxaW42b3FkNmp0eA=="
        target="_blank"
      >
        <img
          class="community"
          src="images/community/rio_padilla_250x250.jpg"
          alt="Rio Padilla"
        />
        <h4>Rio Padilla</h4>
        <span>Community Support</span>
      </a>
      <a
        class="pip-grid-item community-item"
        href="https://www.youtube.com/@jamesdenson4730"
        target="_blank"
      >
        <img
          class="community"
          src="images/community/jim_d_250x250.jpg"
          alt="Jim D."
        />
        <h4>Jim D.</h4>
        <span>Community Support</span>
      </a>
    </div>
    <div class="pip-grid" aria-label="Community Support">
      <a
        class="pip-grid-item"
        href="https://github.com/rikkuness"
        target="_blank"
      >
        <h4>rikkuness</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/gfwilliams"
        target="_blank"
      >
        <h4>gfwilliams</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/rblakesley"
        target="_blank"
      >
        <h4>rblakesley</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/gnargle"
        target="_blank"
      >
        <h4>gnargle</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/MercurialPony"
        target="_blank"
      >
        <h4>MercurialPony</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/pip-4111"
        target="_blank"
      >
        <h4>pip-4111</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/killes007"
        target="_blank"
      >
        <h4>killes007</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/TetrisKid48"
        target="_blank"
      >
        <h4>TetrisKid48</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/tylerjbartlett"
        target="_blank"
      >
        <h4>tylerjbartlett</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/AidansLab"
        target="_blank"
      >
        <h4>AidansLab</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/Dougie-1"
        target="_blank"
      >
        <h4>Dougie</h4>
        <span>Engineer</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://linktr.ee/Forgone.Z"
        target="_blank"
      >
        <h4>Forgone.Z</h4>
        <span>Technical Support</span>
      </a>
      <a
        class="pip-grid-item"
        href="https://github.com/beaverboy-12"
        target="_blank"
      >
        <h4>beaverboy-12</h4>
        <span>Technical Support</span>
      </a>
      <!-- Currently no link per request -->
      <a class="pip-grid-item" href>
        <h4>Matchwood</h4>
        <span>Technical Support</span>
      </a>
    </div>
    <pip-button aria-label="Support Button" (click)="openGitHubPage()">
      View Project on GitHub
    </pip-button>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeCommunitySection {
  protected openGitHubPage(): void {
    window.open('https://github.com/CodyTolene/pip-terminal', '_blank');
  }
}
