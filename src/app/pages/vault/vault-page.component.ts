import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { APP_VERSION } from 'src/app/constants';
import { PipFooterComponent } from 'src/app/layout';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

@UntilDestroy()
@Component({
  selector: 'pip-vault-page',
  templateUrl: './vault-page.component.html',
  styleUrls: ['./vault-page.component.scss'],
  imports: [CommonModule, MatTooltipModule, PipFooterComponent],
  standalone: true,
})
export class VaultPageComponent {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  protected readonly userChanges = this.auth.userChanges;
  protected readonly versionNumber = APP_VERSION;

  protected signOut(): void {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to logout?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldLogout) => {
        if (!shouldLogout) return;
        await this.auth.signOut();
        await this.router.navigate(['']);
      });
  }
}
