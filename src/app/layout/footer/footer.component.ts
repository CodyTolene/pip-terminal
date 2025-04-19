import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PipTimeService } from 'src/app/services/pip/pip-time.service';
import { TabsService } from 'src/app/services/tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  imports: [CommonModule, DateTimePipe, MatIconModule, MatTooltipModule],
  styleUrl: './footer.component.scss',
  providers: [],
  standalone: true,
})
export class FooterComponent {
  public constructor(
    private readonly pipTimeService: PipTimeService,
    private readonly tabsService: TabsService,
  ) {
    this.isTimeBlinkingChanges = this.pipTimeService.isTimeBlinkingChanges;
    this.timeChanges = this.pipTimeService.timeChanges;
  }

  protected readonly pipSignals = pipSignals;
  protected readonly versionNumber = APP_VERSION;

  protected readonly isTimeBlinkingChanges: Observable<boolean>;
  protected readonly timeChanges: Observable<DateTime>;

  protected async goToClockTab(): Promise<void> {
    await this.tabsService.switchToTab(
      TabLabelEnum.DATA,
      SubTabLabelEnum.CLOCK,
    );
  }
}
