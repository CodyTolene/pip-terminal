import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'pip-divider',
  template: `<hr />`,
  styles: [
    `
      @use '../../styles/colors' as col;
      @use '../../styles/variables' as var;
      :host {
        display: block;
        box-sizing: border-box;
        width: 100%;
      }
      hr {
        border: 0;
        border-top: 2px dashed rgba(col.$pip-green-darkest, 0.8);
        width: 100%;
        margin: 3rem auto;
      }
    `,
  ],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PipDividerComponent {}
