import { DateTime } from 'luxon';
import { map, shareReplay, timer } from 'rxjs';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-footer',
  templateUrl: './pip-footer.component.html',
  imports: [CommonModule, DateTimePipe, MatIconModule],
  styleUrl: './pip-footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent {
  protected readonly pipSignals = pipSignals;
  protected readonly versionNumber = '1.4.2';

  protected readonly subscriptionChanges = timer(0, 1000).pipe(
    map(() => DateTime.local()),
    shareReplay(1),
  );

  protected readonly isBlinkingChanges = this.subscriptionChanges.pipe(
    map((date) => date.second % 2 === 0),
  );
}
