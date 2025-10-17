import {
  doc as fsDoc,
  getDoc as fsGetDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Observable, ReplaySubject, map } from 'rxjs';
import { FirestoreProfileApi, PipUser } from 'src/app/models';
import { shareSingleReplay } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  onIdTokenChanged,
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
        // Tear down any previous listeners
        if (this.extrasUnsub) {
          this.extrasUnsub();
          this.extrasUnsub = undefined;
        }
        if (this.tokenUnsub) {
          this.tokenUnsub();
          this.tokenUnsub = undefined;
        }

        if (!user) {
          this.userSubject.next(null);
          return;
        }

        // Emit immediately using current extras and fresh claims
        try {
          const [profile, role] = await Promise.all([
            this.getUserProfile(user.uid),
            this.getUserRole(user, true),
          ]);

          const hydratedUser = PipUser.deserialize({
            user,
            profile: {
              dateOfBirth: profile?.dateOfBirth ?? undefined,
              roomNumber: profile?.roomNumber ?? undefined,
              skill: profile?.skill ?? undefined,
              vaultNumber: profile?.vaultNumber ?? undefined,
            },
            role,
          });

          this.userSubject.next(hydratedUser);
        } catch (err) {
          console.error(
            '[AuthService] initial hydrate failed (non-fatal), reset.',
            err,
          );
          this.userSubject.next(null);
          return;
        }

        // Live update when users/{uid} changes
        const ref = fsDoc(this.firestore, 'users', user.uid);
        this.extrasUnsub = onSnapshot(
          ref,
          async (snap) => {
            const data = snap.exists()
              ? (snap.data() as PipUser['profile'])
              : undefined;

            // Keep the latest role in step even if only profile changed
            const role = await this.getUserRole(user, false);

            const profile = {
              dateOfBirth: data?.dateOfBirth ?? undefined,
              roomNumber: data?.roomNumber ?? undefined,
              skill: data?.skill ?? undefined,
              vaultNumber: data?.vaultNumber ?? undefined,
            };

            this.userSubject.next(PipUser.deserialize({ user, profile, role }));
          },
          (error) => {
            console.error('[AuthService] onSnapshot error:', error);
            // Keep last good value; do not push null here
          },
        );

        // Also react to claim changes while signed in
        this.tokenUnsub = onIdTokenChanged(this.auth, async (u) => {
          if (!u) return;
          try {
            const [profile, role] = await Promise.all([
              this.getUserProfile(u.uid),
              this.getUserRole(u, false),
            ]);
            const next = PipUser.deserialize({ user: u, profile, role });
            this.userSubject.next(next);
          } catch (e) {
            console.error('[AuthService] onIdTokenChanged hydrate failed:', e);
          }
        });
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
  private tokenUnsub?: () => void;

  private readonly userSubject = new ReplaySubject<PipUser | null>(1);

  public readonly userChanges: Observable<PipUser | null> = this.userSubject
    .asObservable()
    .pipe(shareSingleReplay<PipUser | null>());

  public readonly isLoggedInChanges: Observable<boolean> =
    this.userChanges.pipe(
      map((user) => user !== null),
      shareSingleReplay<boolean>(),
    );

  public authReady(): Promise<void> {
    const anyAuth = this.auth as unknown as {
      authStateReady?: () => Promise<void>;
    };
    return anyAuth.authStateReady
      ? anyAuth.authStateReady()
      : Promise.resolve();
  }

  public patchUserProfile(user: PipUser, profile: FirestoreProfileApi): void {
    // Preserve role when patching the profile
    const updatedUser = new PipUser({
      native: user.native,
      profile,
      role: user.role,
    });
    this.userSubject.next(updatedUser);
  }

  public sendEmailVerification(): Promise<void> {
    const user = this.auth.currentUser;
    if (!user) {
      return Promise.resolve();
    }
    return sendEmailVerification(user);
  }

  public signInWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  public signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(this.auth, provider);
  }

  public signOut(): Promise<void> {
    // Clean up listeners on sign out
    if (this.extrasUnsub) {
      this.extrasUnsub();
      this.extrasUnsub = undefined;
    }
    if (this.tokenUnsub) {
      this.tokenUnsub();
      this.tokenUnsub = undefined;
    }
    return signOut(this.auth);
  }

  public signUpWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  private async getUserProfile(
    uid: string,
  ): Promise<PipUser['profile'] | undefined> {
    const ref = fsDoc(this.firestore, 'users', uid);
    const snap = await fsGetDoc(ref);
    return snap.exists() ? (snap.data() as PipUser['profile']) : undefined;
  }

  private async getUserRole(
    user: User,
    force: boolean,
  ): Promise<'admin' | 'user' | null> {
    const token = await getIdTokenResult(user, force);
    const roleClaim = token.claims['role'];
    return typeof roleClaim === 'string'
      ? (roleClaim as 'admin' | 'user')
      : null;
  }
}
