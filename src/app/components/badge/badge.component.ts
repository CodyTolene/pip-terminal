import { Component } from '@angular/core';

@Component({
  selector: 'pip-badge',
  template: `<ng-content />`,
  imports: [],
  styles: [
    `
      :host {
        background: var(--pip-green, #5aff5a);
        border-radius: 4px;
        color: var(--pip-black, #0b0f0b);
        font-size: 0.75rem;
        letter-spacing: 0.08em;
        padding: 0.125rem 0.4rem;
      }
    `,
  ],
  standalone: true,
})
export class PipLogComponent {}
