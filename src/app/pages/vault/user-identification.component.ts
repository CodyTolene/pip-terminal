import { InputComponent } from '@proangular/pro-form';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { map } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { ScreenSizeEnum } from 'src/app/enums';
import { PipUser } from 'src/app/models';
import { userIdentificationFormGroup } from 'src/app/pages/vault/user-identification-form-group';
import {
  isEditModeSignal,
  isSavingSignal,
} from 'src/app/pages/vault/vault.signals';
import { ScreenService, UserProfileService } from 'src/app/services';
import { isNumber, toNumber } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, inject } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-user-identification[user]',
  templateUrl: './user-identification.component.html',
  styleUrls: ['./user-identification.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ImageCropperComponent,
    InputComponent,
    ReactiveFormsModule,
    PipButtonComponent,
  ],
  standalone: true,
})
export class UserIdentificationComponent implements OnInit {
  @Input({ required: true }) public user!: PipUser;

  // @ViewChild(ImageCropperComponent)
  // private readonly cropper?: ImageCropperComponent;

  protected readonly formGroup = userIdentificationFormGroup;

  private readonly screenService = inject(ScreenService);
  private readonly userProfile = inject(UserProfileService);

  protected readonly isMobileChanges =
    this.screenService.screenSizeChanges.pipe(
      map((size) => size === ScreenSizeEnum.MOBILE),
    );

  protected readonly isEditModeSignal = isEditModeSignal;
  protected readonly isSavingSignal = isSavingSignal;
  protected readonly versionNumber = APP_VERSION;

  protected selectedImageEvent: Event | null = null;
  protected selectedFile: File | null = null;
  protected croppedImage: string | null = null;

  public ngOnInit(): void {
    if (!this.user) {
      throw new Error('UserIdentificationComponent requires a user input');
    }

    this.formGroup.patchValue({
      displayName: this.user.displayName,
      vaultNumber: this.user.vaultNumber,
    });
  }

  protected cancelEdit(): void {
    this.isEditModeSignal.set(false);
  }

  protected async deleteImage(): Promise<void> {
    if (this.isSavingSignal()) {
      return;
    }

    this.isSavingSignal.set(true);

    try {
      await this.userProfile.deleteProfileImage(this.user.uid);

      this.selectedImageEvent = null;
      this.selectedFile = null;
      this.croppedImage = null;
    } catch (err) {
      console.error('[User ID Component] deleteImage failed', err);
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
      console.warn(
        '[User ID Component] file selected: no file present on input',
      );
    }

    this.selectedImageEvent = event;
    this.croppedImage = null;
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? null;
  }

  protected onLoadImageFailed(evt: unknown): void {
    console.error('[User ID Component] cropper failed to load image', evt);
  }

  protected async saveProfile(): Promise<void> {
    if (this.isSavingSignal()) {
      return;
    }

    if (this.formGroup.invalid) {
      // Touch all fields so inline messages render
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isSavingSignal.set(true);

    try {
      if (this.selectedFile) {
        let dataUrlToUpload: string | null = null;

        if (this.croppedImage) {
          dataUrlToUpload = this.croppedImage;
        } else if (!this.selectedImageEvent) {
          dataUrlToUpload = await this.fallbackCenterCrop();
        } else {
          console.warn(
            '[User ID Component] Cropper active but no cropped image yet. Aborting.',
          );
        }

        if (dataUrlToUpload) {
          const blob = this.dataURItoBlob(dataUrlToUpload);
          const previousUrl = this.user.photoURL ?? null;

          await this.userProfile.uploadProfileImage(
            this.user.uid,
            blob,
            previousUrl,
          );
        }
      }

      const { displayName, vaultNumber } = this.formGroup.getRawValue();

      const vaultNumberParsed = isNumber(vaultNumber)
        ? vaultNumber
        : toNumber(vaultNumber);

      if (displayName !== '' && displayName !== (this.user.displayName ?? '')) {
        await updateProfile(this.user.native, { displayName });
      }

      if (vaultNumberParsed !== null) {
        await this.userProfile.updateUserProfile(this.user.uid, {
          vaultNumber: vaultNumberParsed,
        });
      }

      this.isEditModeSignal.set(false);

      this.selectedImageEvent = null;
      this.selectedFile = null;
      this.croppedImage = null;
    } catch (err) {
      console.error('[User ID Component] Failed to save profile', err);
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  private dataURItoBlob(dataURI: string): Blob {
    const headerAndData = dataURI.split(',');
    const header = headerAndData[0] ?? '';
    const data = headerAndData[1] ?? '';

    const mimeString = header.split(':')[1]?.split(';')[0] ?? 'image/png';
    const byteString = atob(data);
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  private async fallbackCenterCrop(): Promise<string | null> {
    if (!this.selectedFile) {
      console.warn('[User ID Component] fallbackCenterCrop: no selected file');
      return null;
    }
    try {
      const bitmap = await createImageBitmap(this.selectedFile);
      const size = 250;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('[User ID Component] fallbackCenterCrop: no 2D context');
        return null;
      }

      const minSide = Math.min(bitmap.width, bitmap.height);
      const sx = Math.floor((bitmap.width - minSide) / 2);
      const sy = Math.floor((bitmap.height - minSide) / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bitmap, sx, sy, minSide, minSide, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/png');
      // eslint-disable-next-line no-console
      console.info('[User ID Component] fallbackCenterCrop produced dataURL');
      return dataUrl;
    } catch (e) {
      console.error('[User ID Component] fallbackCenterCrop failed', {
        message: (e as Error).message,
      });
      return null;
    }
  }
}
