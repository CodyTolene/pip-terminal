import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { DateTimePipe } from 'src/app/pipes';
import { pipSignals } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipTimeService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-time.service';

@Component({
  selector: 'pip-boy-3000-mk-iv-footer',
  templateUrl: './pip-boy-3000-mk-iv-footer.component.html',
  imports: [CommonModule, DateTimePipe, MatIconModule, MatTooltipModule],
  styleUrl: './pip-boy-3000-mk-iv-footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipBoy3000MkIVFooterComponent {
  public constructor(private readonly pipTimeService: PipTimeService) {
    this.isTimeBlinkingChanges = this.pipTimeService.isTimeBlinkingChanges;
    this.timeChanges = this.pipTimeService.timeChanges;
  }

  protected readonly pipSignals = pipSignals;
  protected readonly versionNumber = APP_VERSION;

  protected readonly isTimeBlinkingChanges: Observable<boolean>;
  protected readonly timeChanges: Observable<DateTime>;
}
