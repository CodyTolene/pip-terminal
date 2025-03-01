import { Component, Input, signal } from '@angular/core';

@Component({
  selector: 'pip-sub-tab',
  template: `@if (isActive()) {
    <ng-content />
  }`,
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipSubTabComponent {
  @Input({ required: true }) public label!: string;
  @Input() public isActive = signal<boolean>(false);
}
