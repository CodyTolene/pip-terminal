import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from '../pip-log/pip-log.component';

@Component({
  selector: 'pip-diagnostics',
  templateUrl: './pip-diagnostics.component.html',
  imports: [CommonModule, PipLogComponent],
  styleUrl: './pip-diagnostics.component.scss',
  providers: [],
  standalone: true,
})
export class PipDiagnosticsComponent {}
