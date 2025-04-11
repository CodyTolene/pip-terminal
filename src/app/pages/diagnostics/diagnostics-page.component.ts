import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from 'src/app/components/log/pip-log.component';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-diagnostics-page',
  templateUrl: './diagnostics-page.component.html',
  imports: [CommonModule, PipLogComponent],
  styleUrl: './diagnostics-page.component.scss',
  providers: [],
  standalone: true,
})
export class DiagnosticsPageComponent {
  protected readonly signals = pipSignals;
}
