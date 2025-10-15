import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'pip-dialog-confirm-component',
  templateUrl: './pip-dialog-confirm.component.html',
  styleUrl: './pip-dialog-confirm.component.scss',
  imports: [MatDialogModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PipDialogConfirmComponent {
  public constructor() {
    const data = inject<PipDialogConfirmInput>(MAT_DIALOG_DATA);

    this.cancelButtonLabel = data.cancelButtonLabel ?? 'Cancel';
    this.confirmButtonLabel = data.confirmButtonLabel ?? 'Confirm';
    this.dialogTitle = data.dialogTitle ?? 'Confirm';
    this.message = data.message;
    this.messageTitle = data.messageTitle ?? 'Are you sure?';
  }

  protected readonly cancelButtonLabel?: string;
  protected readonly confirmButtonLabel?: string;
  protected readonly dialogTitle?: string;
  protected readonly message: string;
  protected readonly messageTitle?: string;
}

export interface PipDialogConfirmInput {
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  dialogTitle?: string;
  message: string;
  messageTitle?: string;
}
