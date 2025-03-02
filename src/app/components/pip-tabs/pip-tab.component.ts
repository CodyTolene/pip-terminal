import {
  Component,
  EventEmitter,
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
  styles: [``],
  // eslint-disable-next-line @angular-eslint/prefer-standalone
  standalone: false,
})
export class PipTabComponent {
  @Input({ required: true }) public label!: string;

  @Input({ required: false })
  public set isActive(value: boolean) {
    this.#isActive.set(value);
  }
  public get isActive(): Signal<boolean> {
    return this.#isActive.asReadonly();
  }

  @Output()
  public readonly isActiveChange = new EventEmitter<boolean>();

  #isActive = signal<boolean>(false);

  public setActive(value: boolean): void {
    this.#isActive.set(value);
    this.isActiveChange.emit(value);
  }
}
