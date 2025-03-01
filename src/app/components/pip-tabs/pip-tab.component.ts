import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'pip-tab',
  template: `@if (isActive()) {
    <ng-content />
  }`,
  styles: [``],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipTabComponent {
  @Input({ required: true }) public label!: string;
  @Input() public isActive = signal<boolean>(false);
}
