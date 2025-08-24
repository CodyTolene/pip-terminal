import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InputComponent } from '@proangular/pro-form';
import { distinctUntilChanged, map } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { ScreenSizeEnum } from 'src/app/enums';
import { PipUser } from 'src/app/models';
import { userIdentificationFormGroup } from 'src/app/pages/vault/user-identification-form-group';
import {
  isEditModeSignal,
  isSavingSignal,
} from 'src/app/pages/vault/vault.signals';
import {
  ScreenService,
  ToastService,
  UserProfileService,
} from 'src/app/services';
import { isNumber, toNumber } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogAvatarComponent,
  PipDialogAvatarResult,
} from 'src/app/components/dialog-avatar/pip-dialog-avatar.component';

@UntilDestroy()
@Component({
  selector: 'pip-user-identification[user]',
  templateUrl: './user-identification.component.html',
  styleUrls: ['./user-identification.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    InputComponent,
    ReactiveFormsModule,
    PipButtonComponent,
  ],
  standalone: true,
})
export class UserIdentificationComponent implements OnInit {
  public constructor() {
    this.formGroup.reset();
  }

  @Input({ required: true }) public user!: PipUser;

  protected croppedImage: string | null = null;
  protected localPhotoUrl: string | null = null;

  protected readonly formGroup = userIdentificationFormGroup;

  private readonly dialog = inject(MatDialog);
  private readonly screenService = inject(ScreenService);
  private readonly toast = inject(ToastService);
  private readonly userProfile = inject(UserProfileService);

  protected readonly isMobileChanges =
    this.screenService.screenSizeChanges.pipe(
      map((size) => size === ScreenSizeEnum.MOBILE),
    );

  protected readonly isEditModeSignal = isEditModeSignal;
  protected readonly isSavingSignal = isSavingSignal;
  protected readonly versionNumber = APP_VERSION;

  public ngOnInit(): void {
    if (!this.user) {
      throw new Error('UserIdentificationComponent requires a user input');
    }

    this.setDefaultValues();

    this.formGroup.controls.displayName.valueChanges
      .pipe(untilDestroyed(this), distinctUntilChanged())
      .subscribe((val) => {
        const trimmed = val.trim();
        if (val !== trimmed) {
          this.formGroup.controls.displayName.setValue(trimmed, {
            emitEvent: false,
          });
        }
      });
  }

  protected cancelEdit(): void {
    this.setDefaultValues();
    this.isEditModeSignal.set(false);
  }

  protected openAvatarDialog(): void {
    const ref = this.dialog.open<
      PipDialogAvatarComponent,
      { user: PipUser },
      PipDialogAvatarResult
    >(PipDialogAvatarComponent, { data: { user: this.user } });

    ref
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe((res) => {
        if (!res) return;
        this.localPhotoUrl = res.photoURL ?? null;
      });
  }

  protected async saveProfile(): Promise<void> {
    if (this.isSavingSignal()) return;
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      this.toast.error({
        message: 'Please fill in all required fields.',
        durationSecs: 3,
      });
      return;
    }

    this.isSavingSignal.set(true);
    try {
      const { displayName, vaultNumber } = this.formGroup.getRawValue();

      const vaultNumberParsed = isNumber(vaultNumber)
        ? vaultNumber
        : toNumber(vaultNumber);

      await this.userProfile.saveProfile(this.user.uid, {
        displayName: (displayName ?? '').trim(),
        vaultNumber: vaultNumberParsed,
      });

      this.toast.success({
        message: 'Vault profile updated successfully.',
        durationSecs: 3,
      });

      this.isEditModeSignal.set(false);

      this.croppedImage = null;
      this.localPhotoUrl = null;
    } catch (err) {
      console.error('[User ID Component] Failed to save profile', err);
      this.toast.error({
        message: 'Failed to save vault profile. Please try again later.',
        durationSecs: 3,
      });
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  private setDefaultValues(): void {
    this.formGroup.patchValue({
      displayName: this.user.displayName || '',
      vaultNumber: this.user.vaultNumber,
    });
  }
}
