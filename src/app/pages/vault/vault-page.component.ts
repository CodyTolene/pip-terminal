import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PipFooterComponent } from 'src/app/layout';
import { isEditModeSignal } from 'src/app/pages/vault/vault.signals';
import { AuthService, ToastService } from 'src/app/services';
import { shareSingleReplay } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

import { UserIdentificationComponent } from './user-identification.component';

@UntilDestroy()
@Component({
  selector: 'pip-vault-page',
  templateUrl: './vault-page.component.html',
  styleUrls: ['./vault-page.component.scss'],
  imports: [
    CommonModule,
    LoadingComponent,
    PipFooterComponent,
    UserIdentificationComponent,
    PipButtonComponent,
  ],
  standalone: true,
})
export class VaultPageComponent {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);

  protected readonly isEditModeSignal = isEditModeSignal;

  protected isLoggingOutSignal = signal<boolean>(false);

  protected readonly userChanges =
    this.auth.userChanges.pipe(shareSingleReplay());

  protected startEdit(): void {
    this.isEditModeSignal.set(true);
  }

  protected signOut(): void {
    this.isLoggingOutSignal.set(true);

    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: { message: `Are you sure you want to logout?` },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldLogout) => {
        try {
          if (!shouldLogout) {
            return;
          }

          await this.auth.signOut();

          this.toast.success({
            message: 'Logged out successfully.',
            durationSecs: 3,
          });
          await this.router.navigate(['']);
        } finally {
          this.isLoggingOutSignal.set(false);
        }
      });
  }
}
