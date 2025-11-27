import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { PipUser } from 'src/app/models';
import { ToastService, UserProfileService } from 'src/app/services';
import { Validation } from 'src/app/utilities';

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'pip-dialog-avatar',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, ImageCropperComponent],
  templateUrl: './pip-dialog-avatar.component.html',
  styleUrls: ['./pip-dialog-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipDialogAvatarComponent {
  private readonly dialogRef = inject(
    MatDialogRef<PipDialogAvatarComponent, PipDialogAvatarResult>,
  );
  private readonly data = inject<PipDialogAvatarInput>(MAT_DIALOG_DATA);
  private readonly toast = inject(ToastService);
  private readonly userProfile = inject(UserProfileService);

  @ViewChild('avatarFileInput', { static: false })
  private fileInput?: ElementRef<HTMLInputElement>;

  protected readonly user = this.data.user;
  protected readonly isSavingSignal = signal(false);

  protected selectedImageEvent: Event | null = null;
  protected selectedFile: File | null = null;
  protected croppedImage: string | null = null;

  protected async deleteImage(): Promise<void> {
    if (this.isSavingSignal()) {
      return;
    }

    this.isSavingSignal.set(true);
    try {
      await this.userProfile.deleteProfileImage(this.user.uid);
      this.toast.success({
        message: 'Profile image deleted successfully.',
        durationSecs: 3,
      });
      this.dialogRef.close({ photoURL: null });
    } catch (e) {
      console.error('[AvatarDialog] delete failed', e);
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement | null;
    const file = input?.files && input.files.length > 0 ? input.files[0] : null;

    if (!file) {
      this.resetSelectionAndInput(input);
      return;
    }

    // Validate type and size right away
    if (!/^image\/.+$/i.test(file.type || '')) {
      this.toast.error({
        message: 'Please select an image file.',
        durationSecs: 3,
      });
      this.resetSelectionAndInput(input);
      return;
    }

    if (file.size >= Validation.maxImageSizeBytes) {
      this.toast.error({
        message: 'Image too large (max 2MB).',
        durationSecs: 3,
      });
      this.resetSelectionAndInput(input);
      return;
    }

    // Valid selection
    this.selectedFile = file;
    this.selectedImageEvent = evt;
    this.croppedImage = null;
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? null;
  }

  protected onLoadImageFailed(err: unknown): void {
    console.error('[AvatarDialog] cropper failed to load image', err);
    this.toast.error({
      message: 'Failed to load image for cropping.',
      durationSecs: 3,
    });
  }

  protected async save(): Promise<void> {
    if (this.isSavingSignal() || !this.selectedFile) {
      return;
    }

    this.isSavingSignal.set(true);

    try {
      const toUpload = this.croppedImage ?? (await this.fallbackCenterCrop());
      if (!toUpload) {
        this.toast.error({
          message: 'Could not prepare image.',
          durationSecs: 3,
        });
        return;
      }

      const blob = this.dataURItoBlob(toUpload);

      // Final guard to match Storage rules
      if (!/^image\/.+$/i.test(blob.type || '')) {
        this.toast.error({
          message: 'Only image files are allowed.',
          durationSecs: 3,
        });
        this.resetSelectionAndInput();
        return;
      }
      if (blob.size >= Validation.maxImageSizeBytes) {
        this.toast.error({
          message: 'Image too large (max 2MB).',
          durationSecs: 3,
        });
        this.resetSelectionAndInput();
        return;
      }

      const previousUrl = this.user.photoURL ?? null;

      const newUrl = await this.userProfile.uploadProfileImage(
        this.user.uid,
        blob,
        previousUrl,
      );
      this.toast.success({
        message: 'Profile image updated successfully.',
        durationSecs: 3,
      });
      this.dialogRef.close({ photoURL: newUrl });
    } catch (e: unknown) {
      // Map expected errors from service
      if (e instanceof Error && e.cause === 'image-too-large') {
        this.toast.error({
          message: 'Image too large (max 2MB).',
          durationSecs: 3,
        });
        this.resetSelectionAndInput();
      } else if (e instanceof Error && e.cause === 'image-bad-type') {
        this.toast.error({
          message: 'Only image files are allowed.',
          durationSecs: 3,
        });
        this.resetSelectionAndInput();
      } else {
        console.error('[AvatarDialog] save failed', e);
        this.toast.error({
          message: 'Failed to update profile image. Please try again later.',
          durationSecs: 3,
        });
      }
    } finally {
      this.isSavingSignal.set(false);
    }
  }

  private resetSelectionAndInput(input?: HTMLInputElement | null): void {
    const el = input ?? this.fileInput?.nativeElement ?? null;
    if (el) el.value = '';
    this.selectedFile = null;
    this.selectedImageEvent = null;
    this.croppedImage = null;
  }

  private dataURItoBlob(dataURI: string): Blob {
    const [header, data] = dataURI.split(',');
    const mime = header.split(':')[1]?.split(';')[0] ?? 'image/png';
    const byteString = atob(data ?? '');
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++)
      ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mime });
  }

  private async fallbackCenterCrop(): Promise<string | null> {
    if (!this.selectedFile) return null;
    try {
      const bitmap = await createImageBitmap(this.selectedFile);
      const size = 300;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const minSide = Math.min(bitmap.width, bitmap.height);
      const sx = Math.floor((bitmap.width - minSide) / 2);
      const sy = Math.floor((bitmap.height - minSide) / 2);

      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(bitmap, sx, sy, minSide, minSide, 0, 0, size, size);
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error('[AvatarDialog] fallbackCenterCrop failed', e);
      return null;
    }
  }
}

export interface PipDialogAvatarInput {
  user: PipUser;
}

export interface PipDialogAvatarResult {
  photoURL: string | null;
}
