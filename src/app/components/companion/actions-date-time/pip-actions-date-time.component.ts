import {
  FormDirective,
  InputComponent,
  InputDatepickerComponent,
  InputTimepickerComponent,
} from '@proangular/pro-form';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { DateTimePipe } from 'src/app/pipes';
import { PipSetDataService, PipTimeService } from 'src/app/services';
import { pipSignals } from 'src/app/signals';

import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-actions-date-time',
  templateUrl: './pip-actions-date-time.component.html',
  imports: [
    CommonModule,
    DateTimePipe,
    InputComponent,
    InputDatepickerComponent,
    InputTimepickerComponent,
    PipButtonComponent,
    PipTitleComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './pip-actions-date-time.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsDateTimeComponent
  extends FormDirective<DateTimeFormGroup>
  implements OnInit
{
  public constructor() {
    super();

    this.timeChanges = this.pipTimeService.timeChanges;

    effect(() => {
      this.updateFormControlState();
    });
  }

  private readonly pipTimeService = inject(PipTimeService);
  private readonly setDataService = inject(PipSetDataService);

  protected override readonly formGroup = formGroup;
  protected readonly signals = pipSignals;
  protected readonly timeChanges: Observable<DateTime>;

  public ngOnInit(): void {
    this.formGroup.controls.date.setValue(DateTime.now());
    this.formGroup.controls.second.setValue(DateTime.now().second);
    this.formGroup.controls.time.setValue(DateTime.now());
  }

  protected clearForm(): void {
    if (
      !this.signals.isConnected() ||
      this.signals.disableAllControls() ||
      this.signals.isUploadingFile() ||
      (this.formGroup.controls.date.value === null &&
        this.formGroup.controls.second.value === null &&
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

      const dateInvalid = this.formGroup.controls.date.invalid;
      const secondsInvalid = this.formGroup.controls.second.invalid;
      const timeInvalid = this.formGroup.controls.time.invalid;

      if (dateInvalid) {
        logMessage('Date is invalid!');
      }
      if (secondsInvalid) {
        logMessage('Second is invalid!');
      }
      if (timeInvalid) {
        logMessage('Time is invalid!');
      }

      return;
    }

    const date: DateTime | null = this.formGroup.get('date')?.value ?? null;
    const second = this.formGroup.get('second')?.value ?? 0;
    const time: DateTime | null = this.formGroup.get('time')?.value ?? null;

    if (!date) {
      throw new Error('Date is required');
    }
    if (!time) {
      throw new Error('Time is required');
    }

    const dateTime = date.set({
      hour: time.hour,
      minute: time.minute,
      second,
      millisecond: 0,
    });

    await this.setDataService.setDateTime(dateTime);
  }

  private updateFormControlState(): void {
    const shouldDisable =
      !pipSignals.isConnected() ||
      pipSignals.disableAllControls() ||
      pipSignals.isUploadingFile();

    if (shouldDisable) {
      this.formGroup.controls.date.disable({ emitEvent: false });
      this.formGroup.controls.second.disable({ emitEvent: false });
      this.formGroup.controls.time.disable({ emitEvent: false });
    } else {
      this.formGroup.controls.date.enable({ emitEvent: false });
      this.formGroup.controls.second.enable({ emitEvent: false });
      this.formGroup.controls.time.enable({ emitEvent: false });
    }
  }
}

interface DateTimeFormGroup {
  date: FormControl<DateTime | null>;
  second: FormControl<number | null>;
  time: FormControl<DateTime | null>;
}

const formGroup = new FormGroup<DateTimeFormGroup>({
  date: new FormControl<DateTime | null>(null, [Validators.required]),
  second: new FormControl<number | null>(null, [
    Validators.required,
    Validators.min(0),
    Validators.max(59),
  ]),
  time: new FormControl<DateTime | null>(null, [Validators.required]),
});
