import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-log',
  templateUrl: './pip-log.component.html',
  imports: [CommonModule],
  styleUrl: './pip-log.component.scss',
  standalone: true,
})
export class PipLogComponent implements AfterViewChecked {
  public constructor(private readonly elementRef: ElementRef) {}

  private previousLogLength = 0;

  protected readonly signals = pipSignals;

  public ngAfterViewChecked(): void {
    const logMessages = this.signals.logMessages();

    if (logMessages.length > this.previousLogLength) {
      this.scrollToBottom();
    }

    this.previousLogLength = logMessages.length;
  }

  private scrollToBottom(): void {
    const element = this.elementRef.nativeElement as HTMLElement;
    if (element) {
      element.scrollTop = element.scrollHeight;
    }
  }
}
