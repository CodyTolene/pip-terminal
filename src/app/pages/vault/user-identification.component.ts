import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { InputComponent, InputDatepickerComponent } from '@proangular/pro-form';
import { firstValueFrom, map } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { VaultNumberDirective } from 'src/app/directives';
import { ScreenSizeEnum } from 'src/app/enums';
import { FirestoreProfileApi, PipUser } from 'src/app/models';
import { userIdentificationFormGroup } from 'src/app/pages/vault/user-identification-form-group';
import {
  isEditModeSignal,
  isSavingSignal,
} from 'src/app/pages/vault/vault.signals';
import { DateTimePipe, VaultNumberPipe } from 'src/app/pipes';
import {
  AuthService,
  ScreenService,
  ToastService,
  UserProfileService,
} from 'src/app/services';
import {
  Validation,
  getFirstNonEmptyValueFrom,
  isNonEmptyString,
  isNumber,
  toNumber,
} from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, effect, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogAvatarComponent,
  PipDialogAvatarResult,
} from 'src/app/components/dialog-avatar/pip-dialog-avatar.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';
import { PipPanelComponent } from 'src/app/components/panel/panel.component';

@UntilDestroy()
@Component({
  selector: 'pip-user-identification[user]',
  templateUrl: './user-identification.component.html',
  styleUrls: ['./user-identification.component.scss'],
  imports: [
    CommonModule,
    DateTimePipe,
    FormsModule,
    InputComponent,
    InputDatepickerComponent,
    LoadingComponent,
    PipButtonComponent,
    PipPanelComponent,
    ReactiveFormsModule,
    VaultNumberDirective,
    VaultNumberPipe,
  ],
  standalone: true,
})
export class UserIdentificationComponent implements OnInit {
  public constructor() {
    this.formGroup.reset();

    effect(() => {
      const isSaving = isSavingSignal();
      if (isSaving) {
        this.formGroup.disable();
      } else {
        this.formGroup.enable();
      }
    });
  }

  @Input({ required: true }) public user!: PipUser;

  protected croppedImage: string | null = null;
  protected localPhotoUrl: string | null = null;

  protected readonly dobMaxDateTime =
    Validation.profile.dateOfBirth.maxDateTime;
  protected readonly dobMinDateTime =
    Validation.profile.dateOfBirth.minDateTime;
  protected readonly formGroup = userIdentificationFormGroup;

  private readonly auth = inject(AuthService);
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

    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
    }
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

  protected async updateProfile(): Promise<void> {
    if (this.isSavingSignal()) {
      return;
    }

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
      const { dateOfBirth, displayName, roomNumber, skill, vaultNumber } =
        this.formGroup.getRawValue();

      if (displayName) {
        await this.userProfile.updateDisplayName(
          this.user.uid,
          displayName.trim(),
        );
      }

      const roomNumberParsed = isNumber(roomNumber)
        ? roomNumber
        : toNumber(roomNumber);

      const vaultNumberParsed = isNumber(vaultNumber)
        ? vaultNumber
        : toNumber(vaultNumber);

      const profile: Partial<FirestoreProfileApi> = {
        dateOfBirth: dateOfBirth?.toISO() ?? null,
        roomNumber: roomNumberParsed,
        skill: isNonEmptyString(skill) ? skill : null,
        vaultNumber: vaultNumberParsed,
      };

      const currentUser = await getFirstNonEmptyValueFrom(
        this.auth.userChanges,
      );

      const profileResult = await this.userProfile.updateProfile(
        this.user.uid,
        {
          ...currentUser.profile,
          ...profile,
        },
      );

      if (!profileResult) {
        this.toast.error({
          message: 'Failed to save vault profile. Please try again later.',
        });
        console.error('[User ID Component] Failed to update profile', profile);
        return;
      }

      // Make sure our local user object is in sync before
      // switching back to the main view (non edit mode)
      this.auth.patchUserProfile(currentUser, profileResult);

      // Await the next emission
      await firstValueFrom(this.auth.userChanges);

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
      dateOfBirth: this.user.dateOfBirth,
      displayName: this.user.displayName || '',
      roomNumber: this.user.roomNumber,
      skill: this.user.skill,
      vaultNumber: this.user.vaultNumber,
    });
  }
}
