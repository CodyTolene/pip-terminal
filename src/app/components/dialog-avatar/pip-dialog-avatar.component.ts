import { ImageCroppedEvent, ImageCropperComponent } from 'ngx-image-cropper';
import { PipUser } from 'src/app/models';
import { UserProfileService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-dialog-avatar',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ImageCropperComponent,
    PipButtonComponent,
  ],
  templateUrl: './pip-dialog-avatar.component.html',
  styleUrls: ['./pip-dialog-avatar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PipDialogAvatarComponent {
  private readonly dialogRef = inject(
    MatDialogRef<PipDialogAvatarComponent, PipDialogAvatarResult>,
  );
  private readonly data = inject<PipDialogAvatarInput>(MAT_DIALOG_DATA);
  private readonly userProfile = inject(UserProfileService);

  protected readonly user = this.data.user;
  protected readonly isSaving = signal(false);

  protected selectedImageEvent: Event | null = null;
  protected selectedFile: File | null = null;
  protected croppedImage: string | null = null;

  protected async deleteImage(): Promise<void> {
    if (this.isSaving()) return;
    this.isSaving.set(true);
    try {
      await this.userProfile.deleteProfileImage(this.user.uid);
      this.dialogRef.close({ photoURL: null });
    } catch (e) {
      console.error('[AvatarDialog] delete failed', e);
    } finally {
      this.isSaving.set(false);
    }
  }

  protected cancel(): void {
    this.dialogRef.close();
  }

  protected onFileSelected(evt: Event): void {
    const input = evt.target as HTMLInputElement | null;
    this.selectedFile =
      input?.files && input.files.length > 0 ? input.files[0] : null;
    this.selectedImageEvent = evt;
    this.croppedImage = null;
  }

  protected onImageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.base64 ?? null;
  }

  protected onLoadImageFailed(err: unknown): void {
    console.error('[AvatarDialog] cropper failed to load image', err);
  }

  protected async save(): Promise<void> {
    if (this.isSaving()) return;
    if (!this.selectedFile) return;

    this.isSaving.set(true);
    try {
      const toUpload = this.croppedImage ?? (await this.fallbackCenterCrop());
      if (!toUpload) return;

      const blob = this.dataURItoBlob(toUpload);
      const previousUrl = this.user.photoURL ?? null;

      const newUrl = await this.userProfile.uploadProfileImage(
        this.user.uid,
        blob,
        previousUrl,
      );
      this.dialogRef.close({ photoURL: newUrl });
    } catch (e) {
      console.error('[AvatarDialog] save failed', e);
    } finally {
      this.isSaving.set(false);
    }
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
