import { DateTime } from 'luxon';
import { map, shareReplay, timer } from 'rxjs';

import { Injectable } from '@angular/core';

/**
 * Service for managing time-related functionalities, including
 * providing the current time and managing time blinking.
 */
@Injectable({ providedIn: 'root' })
export class PipTimeService {
  /**
   * An observable that emits the current date and time every second.
   * The emitted value is a Luxon DateTime object.
   */
  public readonly timeChanges = timer(0, 1000).pipe(
    map(() => DateTime.local()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  /**
   * An observable that emits either true or false every second,
   * used for indicating a second has passed visually.
   */
  public readonly isTimeBlinkingChanges = this.timeChanges.pipe(
    map((date) => date.second % 2 === 0),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
