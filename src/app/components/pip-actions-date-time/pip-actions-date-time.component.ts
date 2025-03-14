import {
  FormDirective,
  InputDatepickerComponent,
  InputTimepickerComponent,
} from '@proangular/pro-form';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { DateTimePipe } from 'src/app/pipes';

import { CommonModule } from '@angular/common';
import { Component, effect } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipSetDataService } from 'src/app/services/pip-set-data.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-actions-date-time',
  templateUrl: './pip-actions-date-time.component.html',
  imports: [
    CommonModule,
    DateTimePipe,
    InputDatepickerComponent,
    InputTimepickerComponent,
    PipButtonComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './pip-actions-date-time.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsDateTimeComponent extends FormDirective<DateTimeFormGroup> {
  public constructor(
    private readonly pipTimeService: PipTimeService,
    private readonly setDataService: PipSetDataService,
  ) {
    super();

    this.timeChanges = this.pipTimeService.timeChanges;

    effect(() => {
      this.updateFormControlState();
    });
  }

  protected override readonly formGroup = formGroup;
  protected readonly signals = pipSignals;
  protected readonly timeChanges: Observable<DateTime>;

  protected clearForm(): void {
    if (
      !this.signals.isConnected() ||
      this.signals.disableAllControls() ||
      (this.formGroup.controls.date.value === null &&
        this.formGroup.controls.time.value === null)
    ) {
      return;
    }

    this.formGroup.reset();
  }

  protected async setDateTimeCurrent(): Promise<void> {
    await this.setDataService.setDateTimeCurrent();
  }

  protected async setDateTime(): Promise<void> {
    if (this.formGroup.invalid) {
      this.highlightInvalidControls();
      // this.scrollToFirstInvalidControl();

      const dateInvalid = this.formGroup.controls.date.invalid;
      const timeInvalid = this.formGroup.controls.time.invalid;

      const message =
        dateInvalid && timeInvalid
          ? 'Date and time invalid!'
          : dateInvalid
            ? 'Date invalid!'
            : 'Time invalid!';

      logMessage(message);
      return;
    }

    const date: DateTime | null = this.formGroup.get('date')?.value ?? null;
    const time: DateTime | null = this.formGroup.get('time')?.value ?? null;

    if (!date || !time) {
      throw new Error('Date and time are required');
    }

    const dateTime = date.set({
      hour: time.hour,
      minute: time.minute,
      second: time.second,
      millisecond: time.millisecond,
    });

    await this.setDataService.setDateTime(dateTime);
  }

  private updateFormControlState(): void {
    const shouldDisable =
      !pipSignals.isConnected() || pipSignals.disableAllControls();

    if (shouldDisable) {
      this.formGroup.controls.date.disable({ emitEvent: false });
      this.formGroup.controls.time.disable({ emitEvent: false });
    } else {
      this.formGroup.controls.date.enable({ emitEvent: false });
      this.formGroup.controls.time.enable({ emitEvent: false });
    }
  }
}

interface DateTimeFormGroup {
  date: FormControl<DateTime | null>;
  time: FormControl<DateTime | null>;
}

const formGroup = new FormGroup<DateTimeFormGroup>({
  date: new FormControl<DateTime | null>(null, [Validators.required]),
  time: new FormControl<DateTime | null>(null, [Validators.required]),
});
