import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-clock',
  templateUrl: './pip-clock.component.html',
  imports: [CommonModule, DateTimePipe],
  styleUrl: './pip-clock.component.scss',
  providers: [],
  standalone: true,
})
export class PipClockComponent {
  public constructor(private readonly pipTimeService: PipTimeService) {
    this.isTimeBlinkingChanges = this.pipTimeService.isTimeBlinkingChanges;
    this.timeChanges = this.pipTimeService.timeChanges;
  }

  protected readonly isTimeBlinkingChanges: Observable<boolean>;
  protected readonly signals = pipSignals;
  protected readonly timeChanges: Observable<DateTime>;
}
