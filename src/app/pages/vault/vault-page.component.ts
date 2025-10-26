import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InputCheckboxComponent } from '@proangular/pro-form';
import { delayWhen, filter, firstValueFrom, timer } from 'rxjs';
import { PipFooterComponent } from 'src/app/layout';
import { isEditModeSignal } from 'src/app/pages/vault/vault.signals';
import {
  AuthService,
  ForumPostsService,
  ToastService,
  UserProfileService,
} from 'src/app/services';
import {
  getFirstNonEmptyValueFrom,
  isNonEmptyValue,
  shareSingleReplay,
} from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';
import { PipDividerComponent } from 'src/app/components/divider/divider.component';
import { PipForumPostWallComponent } from 'src/app/components/forum/post/post-wall.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

import { UserIdentificationComponent } from './user-identification.component';

@UntilDestroy()
@Component({
  selector: 'pip-vault-page',
  templateUrl: './vault-page.component.html',
  styleUrls: ['./vault-page.component.scss'],
  imports: [
    CommonModule,
    InputCheckboxComponent,
    LoadingComponent,
    PipButtonComponent,
    PipDividerComponent,
    PipFooterComponent,
    PipForumPostWallComponent,
    PipTitleComponent,
    ReactiveFormsModule,
    UserIdentificationComponent,
  ],
  providers: [ForumPostsService],
  standalone: true,
})
export class VaultPageComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly toast = inject(ToastService);
  private readonly userProfile = inject(UserProfileService);

  protected readonly disableAdsCheckbox = new FormControl<boolean>(false);

  protected readonly isEditModeSignal = isEditModeSignal;

  protected isLoggingOutSignal = signal<boolean>(false);
  protected isSavingSignal = signal<boolean>(false);

  protected readonly userChanges = this.auth.userChanges.pipe(
    // Delay user changes by 2 seconds to display loader
    delayWhen(() => (environment.isProduction ? timer(2000) : timer(0))),
    shareSingleReplay(),
  );

  public async ngOnInit(): Promise<void> {
    const user = await getFirstNonEmptyValueFrom(this.userChanges);
    const disableAds = user.disableAds;
    this.disableAdsCheckbox.setValue(disableAds);

    this.disableAdsCheckbox.valueChanges
      .pipe(filter(isNonEmptyValue), untilDestroyed(this))
      .subscribe(async (disableAds) => {
        this.isSavingSignal.set(true);
        this.disableAdsCheckbox.disable({ emitEvent: false });

        try {
          const currentUser = await getFirstNonEmptyValueFrom(
            this.auth.userChanges,
          );

          const profileResult = await this.userProfile.updateProfile(
            currentUser.uid,
            {
              ...currentUser.profile,
              disableAds,
            },
          );

          if (!profileResult) {
            this.toast.error({
              message:
                'Failed to save Advertisement Settings. Please try again later.',
            });
            console.error('[Vault Page Component] Failed to update profile', {
              disableAds,
            });
            return;
          }

          this.auth.patchUserProfile(currentUser, profileResult);

          // Await the next emission
          await firstValueFrom(this.auth.userChanges);

          this.toast.success({
            message: `Advertisement preference updated.`,
            durationSecs: 3,
          });
        } catch {
          // Revert checkbox value on error
          this.disableAdsCheckbox.setValue(!disableAds, {
            emitEvent: false,
          });

          this.toast.error({
            message: `Failed to update advertisement preference.`,
            durationSecs: 5,
          });
        } finally {
          this.disableAdsCheckbox.enable({ emitEvent: false });
          this.isSavingSignal.set(false);
        }
      });
  }

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

  public ngOnDestroy(): void {
    this.isEditModeSignal.set(false);
  }
}
