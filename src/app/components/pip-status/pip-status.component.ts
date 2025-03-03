import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-status',
  templateUrl: './pip-status.component.html',
  imports: [CommonModule, MatIconModule],
  styleUrl: './pip-status.component.scss',
  standalone: true,
})
export class PipStatusComponent {
  protected signals = pipSignals;
}
