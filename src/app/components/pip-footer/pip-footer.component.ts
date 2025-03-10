import { DateTime } from 'luxon';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pip-footer',
  templateUrl: './pip-footer.component.html',
  imports: [CommonModule, DateTimePipe],
  styleUrl: './pip-footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {
  protected readonly currentDateTime = DateTime.local();
}
