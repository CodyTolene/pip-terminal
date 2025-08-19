// Use Firebase Web SDK functions (no Angular injection context required):
import {
  FirestoreDataConverter as FsConverter,
  doc as fsDoc,
  getDoc as fsGetDoc,
  setDoc as fsSetDoc,
} from 'firebase/firestore';
import {
  getDownloadURL as stGetDownloadURL,
  ref as stRef,
  uploadBytes as stUploadBytes,
} from 'firebase/storage';

import { Injectable, inject } from '@angular/core';
import { Auth, User, updateProfile } from '@angular/fire/auth';
// Get instances via AngularFire providers:
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
  private readonly firestore = inject(Firestore);
  private readonly storage = inject(Storage);
  private readonly auth = inject(Auth);

  public async getUserProfile(uid: string): Promise<UserExtras | null> {
    const docRef = fsDoc(this.firestore, 'users', uid).withConverter(
      userExtrasConverter,
    );
    const snap = await fsGetDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    } else {
      return null;
    }
  }

  public async updateUserProfile(
    uid: string,
    data: Partial<UserExtras>,
  ): Promise<void> {
    const docRef = fsDoc(this.firestore, 'users', uid).withConverter(
      userExtrasConverter,
    );
    await fsSetDoc(docRef, data, { merge: true });
  }

  public async uploadProfileImage(uid: string, file: Blob): Promise<string> {
    const filePath = `users/${uid}/images/profile.png`;
    const storageRef = stRef(this.storage, filePath);

    await stUploadBytes(storageRef, file, {
      contentType: 'image/png',
      cacheControl: 'public, max-age=31536000, immutable',
    });

    const url = await stGetDownloadURL(storageRef);

    const user: User | null = this.auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL: url });
    }

    // Mirror in Firestore for easier querying
    await this.updateUserProfile(uid, { photoURL: url });

    return url;
  }
}
