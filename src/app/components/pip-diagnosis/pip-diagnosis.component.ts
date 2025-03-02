import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipLogComponent } from '../pip-log/pip-log.component';

@Component({
  selector: 'pip-diagnosis',
  templateUrl: './pip-diagnosis.component.html',
  imports: [CommonModule, PipLogComponent],
  styleUrl: './pip-diagnosis.component.scss',
  providers: [],
  standalone: true,
})
export class PipDiagnosisComponent {}
