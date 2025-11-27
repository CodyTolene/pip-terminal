import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'pip-panel',
  template: `<ng-content />`,
  imports: [],
  styleUrl: './panel.component.scss',
  providers: [],
})
export class PipPanelComponent {
  @Input()
  @HostBinding('class')
  public color: 'default' | 'warn' = 'default';
}
