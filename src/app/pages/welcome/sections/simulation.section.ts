import { environment } from 'src/environments/environment';

import { Component, inject } from '@angular/core';
import { Analytics, logEvent } from '@angular/fire/analytics';

import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'section[welcome-simulation]',
  template: `
    <pip-title h2>Simulation Terminals</pip-title>
    <p class="simulation-cta__body">
      Simulation work is hosted separately to keep it clearly non-commercial.
    </p>
    <div class="simulation-cta" aria-label="Simulation terminals">
      <span class="simulation-cta__badge">External Site</span>
      <a
        class="simulation-cta__button"
        [href]="simulationUrl"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open Simulation Terminals in a new tab"
        (click)="trackSimulationClick()"
      >
        Open Simulation Terminals
      </a>
      <div class="simulation-cta__subtext">
        Opens pip-terminal.com in a new tab.
      </div>
      <div class="simulation-cta__disclaimer">
        <span>Simulation work is hosted separately.</span>
        <span>No official game assets are included.</span>
      </div>
    </div>
  `,
  styleUrls: ['./welcome-section.scss'],
  imports: [PipTitleComponent],
  styles: [
    `
      @use '../../../styles/colors' as col;
      @use '../../../styles/variables' as var;
      :host {
        margin-bottom: 2.5rem;
      }

      pip-title[h2] {
        margin-top: 1rem;
        margin-bottom: 0;
      }

      .simulation-cta__body {
        margin-bottom: 1.5rem;
      }

      .simulation-cta {
        align-items: center;
        background:
          linear-gradient(
            160deg,
            rgba(0, 255, 0, 0.08),
            rgba(0, 255, 0, 0.02) 55%,
            rgba(0, 0, 0, 0.4)
          ),
          repeating-linear-gradient(
            180deg,
            rgba(0, 255, 0, 0.04),
            rgba(0, 255, 0, 0.04) 2px,
            transparent 2px,
            transparent 5px
          );
        border: 1px solid col.$pip-green-dark;
        box-shadow:
          inset 0 0 18px rgba(0, 255, 0, 0.12),
          0 0 12px rgba(0, 255, 0, 0.12);
        display: flex;
        flex-direction: column;
        gap: 0.9rem;
        max-width: 560px;
        overflow: hidden;
        padding: 2rem 1.75rem;
        position: relative;
      }

      .simulation-cta::before {
        content: '';
        position: absolute;
        inset: 0.5rem;
        border: 1px solid rgba(0, 255, 0, 0.18);
        pointer-events: none;
      }

      .simulation-cta::after {
        content: '';
        position: absolute;
        inset: 0.5rem;
        background: linear-gradient(
          180deg,
          transparent 0%,
          rgba(0, 255, 0, 0.12) 50%,
          transparent 100%
        );
        opacity: 0.22;
        animation: scanline-sweep 12s ease-in-out infinite alternate;
        will-change: transform;
        pointer-events: none;
      }

      .simulation-cta__badge {
        border: 1px solid rgba(0, 255, 0, 0.4);
        color: col.$pip-green-lightest;
        font-size: var.$font-xxs;
        letter-spacing: 0.12em;
        padding: 0.25rem 0.6rem;
        text-transform: uppercase;
      }

      .simulation-cta__button {
        background: linear-gradient(
          180deg,
          rgba(0, 255, 0, 0.9),
          rgba(0, 204, 0, 0.9)
        );
        border: 1px solid col.$pip-green-dark;
        color: col.$pip-black;
        display: inline-flex;
        font-family: var.$default-font-family;
        font-size: var.$font-md;
        justify-content: center;
        letter-spacing: 0.06em;
        padding: 0.85rem 2.2rem;
        position: relative;
        text-decoration: none;
        text-transform: uppercase;
        transition:
          box-shadow 0.2s ease,
          transform 0.2s ease,
          filter 0.2s ease;
      }

      .simulation-cta__button::after {
        content: '>>';
        margin-left: 0.65rem;
        font-size: 0.9em;
      }

      .simulation-cta__button:hover,
      .simulation-cta__button:focus-visible {
        box-shadow:
          0 0 16px rgba(0, 255, 0, 0.35),
          inset 0 0 10px rgba(0, 0, 0, 0.2);
        filter: brightness(1.05);
        transform: translateY(-2px);
      }

      .simulation-cta__subtext,
      .simulation-cta__disclaimer {
        font-size: var.$font-xxs;
      }

      .simulation-cta__disclaimer {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        opacity: 0.9;
      }

      @keyframes scanline-sweep {
        0% {
          transform: translateY(-40%);
          opacity: 0;
        }
        50% {
          opacity: 0.22;
        }
        100% {
          transform: translateY(40%);
          opacity: 0;
        }
      }
    `,
  ],
})
export class WelcomeSimulationSection {
  private readonly analytics = environment.isProduction
    ? inject(Analytics)
    : null;

  protected readonly simulationUrl = 'https://pip-terminal.com/';

  protected trackSimulationClick(): void {
    if (!this.analytics) {
      return;
    }

    logEvent(this.analytics, 'open_simulation_terminals', {
      from: 'pip-boy.com',
      to: 'pip-terminal.com',
    });
  }
}
