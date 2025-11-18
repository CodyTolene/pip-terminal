import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PipBadgeComponent } from 'src/app/components/badge/badge.component';
import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { PageUrl } from 'src/app/types/page-url';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-forum]',
  template: `
    <div class="forum-header">
      <pip-title h2>Community Forum</pip-title>
      <pip-badge>NEW</pip-badge>
    </div>

    <p>
      Report to the commons and make your mark on the record. Share blueprints,
      request assistance from the engineering corps, and greet new arrivals to
      the vault. The community terminal is open, secure, and ready for your
      first holotape upload.
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
        Join the Discord
      </pip-button>
    </div>
  `,
  styleUrls: ['./welcome-section.scss'],
  styles: [
    `
      :host {
        align-items: center;
        display: flex;
        flex-direction: column;

        .forum-header {
          align-items: center;
          display: flex;
          gap: 0.5rem;
          justify-content: center;
          flex-direction: row;
          margin-bottom: 1rem;

          pip-title {
            margin: 0;
          }
        }

        .actions {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
      }
    `,
  ],
  imports: [
    PipBadgeComponent,
    PipButtonComponent,
    PipTitleComponent,
    RouterModule,
  ],
})
export class WelcomeForumSection {
  protected readonly forumLink = forumLink;

  protected openDiscordPage(): void {
    window.open('https://discord.gg/zQmAkEg8XG', '_blank');
  }
}

const forumLink = '/' + ('forum' satisfies PageUrl);
