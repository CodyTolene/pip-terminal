import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { PipTimeService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-time.service';

@Component({
  selector: 'pip-boy-3000-mk-iv-footer',
  templateUrl: './pip-boy-3000-mk-iv-footer.component.html',
  imports: [CommonModule, DateTimePipe],
  styleUrl: './pip-boy-3000-mk-iv-footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipBoy3000MkIVFooterComponent {
  public constructor() {
    this.isTimeBlinkingChanges = this.pipTimeService.isTimeBlinkingChanges;
    this.timeChanges = this.pipTimeService.timeChanges;
  }

  private readonly pipTimeService = inject(PipTimeService);

  protected readonly versionNumber = APP_VERSION;

  protected readonly isTimeBlinkingChanges: Observable<boolean>;
  protected readonly timeChanges: Observable<DateTime>;
}
