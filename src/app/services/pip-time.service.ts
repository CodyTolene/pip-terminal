import { DateTime } from 'luxon';
import { map, shareReplay, timer } from 'rxjs';

import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PipTimeService {
  public readonly timeChanges = timer(0, 1000).pipe(
    map(() => DateTime.local()),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  public readonly isTimeBlinkingChanges = this.timeChanges.pipe(
    map((date) => date.second % 2 === 0),
    shareReplay({ bufferSize: 1, refCount: true }),
  );
}
