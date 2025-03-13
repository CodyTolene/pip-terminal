import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PipTabsService } from 'src/app/services/pip-tabs.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

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
  public constructor(
    private readonly pipTabsService: PipTabsService,
    private readonly pipTimeService: PipTimeService,
  ) {
    this.isTimeBlinkingChanges = this.pipTimeService.isTimeBlinkingChanges;
    this.timeChanges = this.pipTimeService.timeChanges;
  }

  protected readonly pipSignals = pipSignals;
  protected readonly versionNumber = APP_VERSION;

  protected readonly isTimeBlinkingChanges: Observable<boolean>;
  protected readonly timeChanges: Observable<DateTime>;

  protected async goToClockTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.DATA,
      PipSubTabLabelEnum.CLOCK,
    );
  }
}
