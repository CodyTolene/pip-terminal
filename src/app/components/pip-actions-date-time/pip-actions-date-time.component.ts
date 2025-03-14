import {
  FormDirective,
  InputDatepickerComponent,
  InputTimepickerComponent,
} from '@proangular/pro-form';
import { DateTime } from 'luxon';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipSetDataService } from 'src/app/services/pip-set-data.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-date-time',
  templateUrl: './pip-actions-date-time.component.html',
  imports: [
    CommonModule,
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
  public constructor(private readonly setDataService: PipSetDataService) {
    super();
  }

  protected override readonly formGroup = formGroup;
  protected readonly signals = pipSignals;

  protected async setDateTimeCurrent(): Promise<void> {
    await this.setDataService.setDateTimeCurrent();
  }

  protected async setDateTime(): Promise<void> {
    if (this.formGroup.invalid) {
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
}

interface DateTimeFormGroup {
  date: FormControl<DateTime | null>;
  time: FormControl<DateTime | null>;
}

const formGroup = new FormGroup<DateTimeFormGroup>({
  date: new FormControl<DateTime | null>(null, [Validators.required]),
  time: new FormControl<DateTime | null>(null, [Validators.required]),
});
