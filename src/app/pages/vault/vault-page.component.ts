import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { APP_VERSION } from 'src/app/constants';
import { PipFooterComponent } from 'src/app/layout';
import { BoolPipe } from 'src/app/pipes';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { User, updateProfile } from '@angular/fire/auth';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';

import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';
import { LoadingComponent } from 'src/app/components/loading/loading.component';

import {
  UserExtras,
  UserProfileService,
} from 'src/app/services/user-profile.service';

@UntilDestroy()
@Component({
  selector: 'pip-vault-page',
  templateUrl: './vault-page.component.html',
  styleUrls: ['./vault-page.component.scss'],
  imports: [
    BoolPipe,
    CommonModule,
    FormsModule,
    ImageCropperComponent,
    LoadingComponent,
    MatTooltipModule,
    PipFooterComponent,
  ],
  standalone: true,
})
export class VaultPageComponent {
  public constructor() {
    this.userChanges.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user) {
        this.displayName = user.displayName ?? '';
        this.currentUser = user;
        void this.loadExtraData(user.uid);
      } else {
        this.extraData = null;
        this.currentUser = null;
      }
    });
  }

  @ViewChild(ImageCropperComponent) private cropper?: ImageCropperComponent;

  private readonly auth = inject(AuthService);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);
  private readonly userProfileService = inject(UserProfileService);

  protected editMode = false;
  protected saving = false;

  protected extraData: UserExtras | null = null;
  private currentUser: User | null = null;

  protected displayName = '';
  protected vaultNumber: number | null = null;

  protected selectedImageEvent: Event | null = null;
  protected selectedFile: File | null = null;
  protected croppedImage: string | null = null;

  protected readonly userChanges = this.auth.userChanges;
  protected readonly versionNumber = APP_VERSION;

  protected cancelEdit(): void {
    this.editMode = false;
    this.saving = false;
    this.selectedImageEvent = null;
    this.selectedFile = null;
    this.croppedImage = null;
  }

  protected deleteImage(): void {
    // TODO: Delete previous photo and set `photoURL` undefined.
    // eslint-disable-next-line no-console
    console.info('[VaultPage] deleteImage called');
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input && input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
      console.warn('[VaultPage] file selected: no file present on input');
    }

    this.selectedImageEvent = event; // drives the cropper UI
    this.croppedImage = null;
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? null;
  }

  protected onLoadImageFailed(evt: unknown): void {
    console.error('[VaultPage] cropper failed to load image', evt);
  }

  protected async saveProfile(): Promise<void> {
    if (this.saving) {
      return;
    }
    this.saving = true;

    const user = this.currentUser;

    try {
      if (!user) {
        throw new Error('No user');
      }

      const uid = user.uid;

      if (this.selectedFile) {
        let dataUrlToUpload: string | null = null;

        if (this.croppedImage) {
          dataUrlToUpload = this.croppedImage;
        } else if (!this.selectedImageEvent) {
          dataUrlToUpload = await this.fallbackCenterCrop();
        } else {
          console.warn(
            '[VaultPage] Cropper active but no cropped image yet. Aborting.',
          );
        }

        if (dataUrlToUpload) {
          const blob = this.dataURItoBlob(dataUrlToUpload);
          await this.userProfileService.uploadProfileImage(uid, blob);
        }
      }

      if (
        this.displayName !== '' &&
        this.displayName !== (user.displayName ?? '')
      ) {
        await updateProfile(user, { displayName: this.displayName });
      }

      const data: Partial<UserExtras> = {};
      if (this.vaultNumber !== null) {
        data.vaultNumber = this.vaultNumber;
      }

      if (Object.keys(data).length > 0) {
        await this.userProfileService.updateUserProfile(uid, data);
      }

      await this.loadExtraData(uid);
      this.editMode = false;

      this.selectedImageEvent = null;
      this.selectedFile = null;
      this.croppedImage = null;
    } catch (err) {
      console.error('[VaultPage] Failed to save profile', err);
    } finally {
      this.saving = false;
    }
  }

  protected signOut(): void {
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
        if (!shouldLogout) {
          return;
        }
        await this.auth.signOut();
        await this.router.navigate(['']);
      });
  }

  protected startEdit(): void {
    this.editMode = true;
    this.selectedImageEvent = null;
    this.selectedFile = null;
    this.croppedImage = null;
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
      console.warn('[VaultPage] fallbackCenterCrop: no selected file');
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
        console.error('[VaultPage] fallbackCenterCrop: no 2D context');
        return null;
      }

      const minSide = Math.min(bitmap.width, bitmap.height);
      const sx = Math.floor((bitmap.width - minSide) / 2);
      const sy = Math.floor((bitmap.height - minSide) / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bitmap, sx, sy, minSide, minSide, 0, 0, size, size);

      const dataUrl = canvas.toDataURL('image/png');
      // eslint-disable-next-line no-console
      console.info('[VaultPage] fallbackCenterCrop produced dataURL');
      return dataUrl;
    } catch (e) {
      console.error('[VaultPage] fallbackCenterCrop failed', {
        message: (e as Error).message,
      });
      return null;
    }
  }

  private async loadExtraData(uid: string): Promise<void> {
    try {
      const profile = await this.userProfileService.getUserProfile(uid);
      this.extraData = profile;
      if (profile) {
        this.vaultNumber = profile.vaultNumber ?? null;
      }
    } catch (err) {
      const user = this.currentUser;
      const authUid = user ? user.uid : '(no user)';
      const path = `users/${uid}`;
      const code = (err as { code?: string }).code ?? '(no code)';
      const message = (err as Error).message;
      console.error('[VaultPage] Failed to load profile data', {
        path,
        authUid,
        code,
        message,
      });
      this.extraData = null;
    }
  }
}
