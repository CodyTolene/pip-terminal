import {
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { FlagReasonEnum } from 'src/app/enums';
import { getEnumValues } from 'src/app/utilities';

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { PipDialogConfirmComponent } from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

@Component({
  selector: 'pip-dialog-flag-component',
  templateUrl: './pip-dialog-flag.component.html',
  styleUrls: [
    '../dialog-confirm/pip-dialog-confirm.component.scss',
    './pip-dialog-flag.component.scss',
  ],
  imports: [
    InputDropdownComponent,
    InputDropdownOptionComponent,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PipDialogFlagComponent extends PipDialogConfirmComponent {
  public constructor() {
    super();

    this.flagReasonControl.setValidators([Validators.required]);
  }

  private readonly dialogRef: MatDialogRef<
    PipDialogFlagComponent,
    PipDialogFlagResult
  > = inject(MatDialogRef<PipDialogFlagComponent, PipDialogFlagResult>);

  protected readonly flagReasonControl = new FormControl<string | null>(null);
  protected readonly flagReasonList = getEnumValues(FlagReasonEnum);
  protected readonly isSaving = signal(false);

  protected cancel(): void {
    this.isSaving.set(false);
    this.dialogRef.close({ reason: null });
  }

  protected save(): void {
    this.isSaving.set(true);
    this.dialogRef.close({ reason: this.flagReasonControl.value });
    this.isSaving.set(false);
  }
}

export interface PipDialogFlagResult {
  reason: string | null;
}
