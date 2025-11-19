import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-intro]',
  template: `
    <pip-title h1>Welcome to Pip-Boy.com!</pip-title>

    <p>
      Dive into the ultimate fan-made Fallout hub! Simulate iconic Pip-Boy
      interfaces right in your browser, build and share custom apps/games, or
      connect with real-world replicas for an immersive wasteland experience.
      Created by fans for fans, collectors, cosplayers, and devs—join our
      growing community and unlock endless Vault-Tec possibilities.
    </p>

    <div class="actions">
      <pip-button
        aria-label="Visit the Community Forum"
        [routerLink]="forumLink"
      >
        Visit the Forum
      </pip-button>
      <pip-button
        aria-label="Visit the Community Discord"
        (click)="openDiscordPage()"
      >
        Join the Wasteland Discord!
      </pip-button>
    </div>
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

      p {
        margin-bottom: 2rem;
      }

      .actions {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1rem;
        justify-content: center;
        margin-bottom: 0;
      }
    `,
  ],
  imports: [PipButtonComponent, PipTitleComponent, RouterModule],
})
export class WelcomeIntroSection {
  protected readonly forumLink = forumLink;

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
