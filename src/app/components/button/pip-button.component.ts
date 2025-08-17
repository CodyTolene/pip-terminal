import { Component, Input } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'pip-button',
  template: `
    <button [class.disabled]="disabled" [disabled]="disabled" disableRipple>
      <ng-content />
    </button>
  `,
  imports: [MatButtonModule],
  styleUrl: './pip-button.component.scss',
  providers: [],
  standalone: true,
})
export class PipButtonComponent extends MatButton {
  @Input({ required: false }) public override color: ThemePalette = 'primary';

  public override get disableRipple(): boolean {
    return true;
  }
}
