import { Component } from '@angular/core';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section [welcome-intro]',
  template: `
    <pip-title h1>Welcome to Pip-Boy.com!</pip-title>
    <p>
      This fan-made site brings Pip-Boy interfaces to life whether you're
      simulating one in your browser or interacting with real hardware like the
      <a href="https://www.thewandcompany.com/fallout-pip-boy/" target="_blank"
        >Pip-Boy 3000 Mk V by The Wand Company</a
      >. Built for fans, collectors, and cosplayers, it's your gateway to a
      fully interactive Fallout experience.
    </p>
  `,
  styleUrls: ['./welcome-section.scss'],
  styles: [
    `
      @use '../../../styles/colors' as col;
      pip-title[h1] {
        margin-bottom: 2rem;
        text-align: center;
        width: 100%;

        &.active {
          color: col.$pip-green;
        }

        &.community-header {
          margin-top: 0;
        }
      }
    `,
  ],
  imports: [PipTitleComponent],
})
export class WelcomeIntroSection {}
