import {
  doc as fsDoc,
  getDoc as fsGetDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Observable, ReplaySubject, map } from 'rxjs';
import { PipUser } from 'src/app/models';
import { shareSingleReplay } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  UserCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public constructor() {
    // Watch auth state and wire Firestore extras in
    this.auth.onAuthStateChanged(
      async (user) => {
        // Tear down any previous Firestore listener
        if (this.extrasUnsub) {
          this.extrasUnsub();
          this.extrasUnsub = undefined;
        }

        if (!user) {
          this.userSubject.next(null);
          return;
        }

        // Emit immediately using current extras (one-time fetch)
        try {
          const profile = await this.getUserProfile(user.uid);
          const hydratedUser = PipUser.deserialize({
            user,
            profile: {
              dateOfBirth: profile?.dateOfBirth ?? undefined,
              roomNumber: profile?.roomNumber ?? undefined,
              skill: profile?.skill ?? undefined,
              vaultNumber: profile?.vaultNumber ?? undefined,
            },
          });
          // console.log(hydratedUser);
          this.userSubject.next(hydratedUser);
        } catch (err) {
          console.error(
            '[AuthService] getUserProfile failed (non-fatal), reset.',
            err,
          );
          this.userSubject.next(null);
          return;
        }

        // Live update when users/{uid} changes
        const ref = fsDoc(this.firestore, 'users', user.uid);
        this.extrasUnsub = onSnapshot(
          ref,
          (snap) => {
            const data = snap.exists()
              ? (snap.data() as PipUser['profile'])
              : undefined;
            const profile = {
              dateOfBirth: data?.dateOfBirth ?? undefined,
              roomNumber: data?.roomNumber ?? undefined,
              skill: data?.skill ?? undefined,
              vaultNumber: data?.vaultNumber ?? undefined,
            };
            this.userSubject.next(PipUser.deserialize({ user, profile }));
          },
          (error) => {
            console.error('[AuthService] onSnapshot error:', error);
            // Keep last good value; do not push null here
          },
        );
      },
      (error) => {
        console.error('[AuthService] onAuthStateChanged error:', error);
        this.userSubject.next(null);
      },
    );
  }

  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);

  private extrasUnsub?: () => void;

  private readonly userSubject = new ReplaySubject<PipUser | null>(1);

  public readonly userChanges: Observable<PipUser | null> = this.userSubject
    .asObservable()
    .pipe(shareSingleReplay<PipUser | null>());

  public readonly isLoggedInChanges: Observable<boolean> =
    this.userChanges.pipe(
      map((user) => user !== null),
      shareSingleReplay<boolean>(),
    );

  private async getUserProfile(
    uid: string,
  ): Promise<PipUser['profile'] | undefined> {
    const ref = fsDoc(this.firestore, 'users', uid);
    const snap = await fsGetDoc(ref);
    return snap.exists() ? (snap.data() as PipUser['profile']) : undefined;
  }

  public authReady(): Promise<void> {
    const anyAuth = this.auth as unknown as {
      authStateReady?: () => Promise<void>;
    };
    return anyAuth.authStateReady
      ? anyAuth.authStateReady()
      : Promise.resolve();
  }

  public sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return Promise.resolve();
    }
    return sendEmailVerification(user);
  }

  public signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  public signUpWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  public signInWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public signOut(): Promise<void> {
    // Clean up Firestore listener on sign out
    if (this.extrasUnsub) {
      this.extrasUnsub();
      this.extrasUnsub = undefined;
    }
    return signOut(this.auth);
  }

  public getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? currentUser.getIdToken() : Promise.resolve(null);
  }
}
