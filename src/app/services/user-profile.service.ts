import { firstValueFrom } from 'rxjs';
import { FirestoreProfileApi, PipUser } from 'src/app/models';
import { AuthService } from 'src/app/services';
import {
  Validation,
  getFirstNonEmptyValueFrom,
  isNonEmptyString,
} from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import {
  Firestore,
  FirestoreDataConverter as FsConverter,
  doc as fsDoc,
  setDoc as fsSetDoc,
} from '@angular/fire/firestore';
import {
  Storage,
  deleteObject,
  getDownloadURL,
  ref as stRef,
  uploadBytes as stUploadBytes,
} from '@angular/fire/storage';

const userExtrasConverter: FsConverter<FirestoreProfileApi> = {
  toFirestore: (data: FirestoreProfileApi) => data,
  fromFirestore: (snap) => snap.data() as FirestoreProfileApi,
};

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  public async deleteProfileImage(uid: string): Promise<void> {
    const user = await firstValueFrom(this.auth.userChanges);
    const currentUrl = user?.photoURL ?? null;

    if (currentUrl && this.isStorageUrl(currentUrl)) {
      try {
        const refToDelete = stRef(this.storage, currentUrl);
        await deleteObject(refToDelete);
      } catch (err) {
        const code =
          typeof err === 'object' && err !== null && 'code' in err
            ? (err as { code?: string }).code
            : undefined;
        if (code !== 'storage/object-not-found') {
          throw err;
        }
      }
    }

    if (user && user.uid === uid) {
      // Clear with empty string to avoid "photoURL must be string" error
      await updateProfile(user.native, { photoURL: '' });
    }
  }

  public async updateDisplayName(
    uid: string,
    displayName: string | null,
  ): Promise<void> {
    if (!isNonEmptyString(displayName)) {
      throw new Error('Invalid display name');
    }

    const user = await getFirstNonEmptyValueFrom(this.auth.userChanges);
    if (user && user.uid === uid) {
      await updateProfile(user.native, { displayName });
    }
  }

  public async updateProfile(
    uid: string,
    data: FirestoreProfileApi,
  ): Promise<FirestoreProfileApi | null> {
    const user = await getFirstNonEmptyValueFrom(this.auth.userChanges);
    if (user && user.uid === uid) {
      const docRef = fsDoc(this.firestore, 'users', uid).withConverter(
        userExtrasConverter,
      );
      await fsSetDoc(docRef, data, { merge: true });
      return data;
    }
    return null;
  }

  public async uploadProfileImage(
    uid: string,
    file: Blob,
    previousUrl?: string | null,
  ): Promise<string> {
    // Enforce image type
    const type = file.type || '';
    if (!/^image\/.+$/i.test(type)) {
      const err = new Error('Only image files are allowed.');
      err.cause = 'image-bad-type';
      throw err;
    }

    // Enforce max size (2 MB)
    const maxSizeBytes = Validation.maxImageSizeBytes;
    if (file.size >= maxSizeBytes) {
      const err = new Error(
        `Image too large (max ${maxSizeBytes / (1024 * 1024)}MB).`,
      );
      err.cause = 'image-too-large';
      throw err;
    }

    const fileName = `profile-${Date.now()}.png`;
    const filePath = `users/${uid}/images/${fileName}`;
    const storageRef = stRef(this.storage, filePath);

    await stUploadBytes(storageRef, file, {
      contentType: type || 'image/png',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    const url = await getDownloadURL(storageRef);

    const user: PipUser | null = await firstValueFrom(this.auth.userChanges);
    if (user && user.uid === uid) {
      await updateProfile(user.native, { photoURL: url });
    }

    if (previousUrl && previousUrl !== url && this.isStorageUrl(previousUrl)) {
      try {
        const oldRef = stRef(this.storage, previousUrl);
        await deleteObject(oldRef);
      } catch (err) {
        const code =
          typeof err === 'object' && err !== null && 'code' in err
            ? (err as { code?: string }).code
            : undefined;
        if (code !== 'storage/object-not-found') {
          // non-fatal, keep going
          console.warn(
            '[UserProfileService] delete old image failed (non-fatal)',
            err,
          );
        }
      }
    }

    return url;
  }

  private isStorageUrl(url: string): boolean {
    return (
      url.startsWith('gs://') ||
      (url.startsWith('https://') && this.isFirebaseStorageHost(url))
    );
  }

  private isFirebaseStorageHost(url: string): boolean {
    try {
      const u = new URL(url);
      return u.hostname === 'firebasestorage.googleapis.com';
    } catch {
      return false;
    }
  }
}
