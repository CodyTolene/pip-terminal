import {
  FirestoreDataConverter as FsConverter,
  deleteField,
  doc as fsDoc,
  setDoc as fsSetDoc,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  ref as stRef,
  uploadBytes as stUploadBytes,
} from 'firebase/storage';
import { firstValueFrom } from 'rxjs';
import { PipUser } from 'src/app/models';
import { AuthService } from 'src/app/services';

import { Injectable, inject } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';
import { Storage } from '@angular/fire/storage';

export interface UserExtras {
  vaultNumber?: number;
  photoURL?: string;
}

const userExtrasConverter: FsConverter<UserExtras> = {
  toFirestore: (data: UserExtras) => data,
  fromFirestore: (snap) => snap.data() as UserExtras,
};

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  private readonly auth = inject(AuthService);
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);

  public async updateUserProfile(
    uid: string,
    data: Partial<UserExtras>,
  ): Promise<void> {
    const docRef = fsDoc(this.firestore, 'users', uid).withConverter(
      userExtrasConverter,
    );
    await fsSetDoc(docRef, data, { merge: true });
  }

  private isStorageUrl(url: string): boolean {
    return (
      url.startsWith('gs://') ||
      url.startsWith('https://firebasestorage.googleapis.com')
    );
  }

  public async uploadProfileImage(
    uid: string,
    file: Blob,
    previousUrl?: string | null,
  ): Promise<string> {
    const fileName = `profile-${Date.now()}.png`;
    const filePath = `users/${uid}/images/${fileName}`;
    const storageRef = stRef(this.storage, filePath);

    await stUploadBytes(storageRef, file, {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    const url = await getDownloadURL(storageRef);

    const user: PipUser | null = await firstValueFrom(this.auth.userChanges);
    if (user && user.uid === uid) {
      await updateProfile(user.native, { photoURL: url });
    }

    await this.updateUserProfile(uid, { photoURL: url });

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

  public async deleteProfileImage(uid: string): Promise<void> {
    const user = await firstValueFrom(this.auth.userChanges);
    const currentUrl = user?.photoURL ?? user?.photoURL ?? null;

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

    const rawDocRef = fsDoc(this.firestore, 'users', uid);
    await fsSetDoc(rawDocRef, { photoURL: deleteField() }, { merge: true });
  }
}
