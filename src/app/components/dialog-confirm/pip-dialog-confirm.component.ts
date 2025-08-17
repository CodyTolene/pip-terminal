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
    this.message = data.message;
  }

  protected readonly message: string;
}

export interface PipDialogConfirmInput {
  message: string;
}
