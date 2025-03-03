import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { clearLog } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-log',
  templateUrl: './pip-log.component.html',
  imports: [CommonModule],
  styleUrl: './pip-log.component.scss',
  providers: [],
  standalone: true,
})
export class PipLogComponent {
  protected readonly signals = pipSignals;

  protected clearLog(): void {
    clearLog();
  }
}
