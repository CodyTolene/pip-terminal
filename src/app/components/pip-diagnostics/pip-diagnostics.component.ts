import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/pip-log/pip-log.component';

import { pipSignals } from 'src/app/signals/pip.signals';

import { clearLog } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-diagnostics',
  templateUrl: './pip-diagnostics.component.html',
  imports: [CommonModule, PipLogComponent],
  styleUrl: './pip-diagnostics.component.scss',
  providers: [],
  standalone: true,
})
export class PipDiagnosticsComponent {
  protected signals = pipSignals;

  protected clearLog(): void {
    clearLog();
  }
}
