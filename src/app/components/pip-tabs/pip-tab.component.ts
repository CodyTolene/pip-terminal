import {
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
  Signal,
  signal,
} from '@angular/core';

@Component({
  selector: 'pip-tab',
  template: `@if (isActive()) {
    <ng-content />
  }`,
  styles: [
    `
      :host:not(.active) {
        display: none;
        visibility: hidden;
      }
    `,
  ],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipTabComponent {
  @Input({ required: true }) public label!: string;

  public set isActive(value: boolean) {
    this.#isActive.set(value);
    this.isActiveChange.emit(value);
  }

  public get isActive(): Signal<boolean> {
    return this.#isActive.asReadonly();
  }

  @HostBinding('class.active')
  public get isActiveClass(): boolean {
    return this.#isActive();
  }

  @Output()
  public readonly isActiveChange = new EventEmitter<boolean>();

  #isActive = signal<boolean>(false);
}
