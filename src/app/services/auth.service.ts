import {
  doc as fsDoc,
  getDoc as fsGetDoc,
  onSnapshot,
} from 'firebase/firestore';
import { Observable, ReplaySubject, Subscription, defer, map } from 'rxjs';
import { FirestoreProfileApi, PipUser } from 'src/app/models';
import { shareSingleReplay } from 'src/app/utilities';

import {
  EnvironmentInjector,
  Injectable,
  inject,
  runInInjectionContext,
} from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  getIdTokenResult,
  idToken,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public constructor() {
    this.auth.onAuthStateChanged(
      async (user) => {
        await this.inCtx(async () => {
          // Tear down any previous listeners
          if (this.extrasUnsub) {
            this.extrasUnsub();
            this.extrasUnsub = undefined;
          }

          if (this.tokenSub) {
            this.tokenSub.unsubscribe();
            this.tokenSub = undefined;
          }

          if (!user) {
            this.userSubject.next(null);
            return;
          }

          // Emit immediately using current extras and fresh claims
          try {
            const [profile, role] = await Promise.all([
              this.getUserProfile(user.uid),
              // Force refresh once on login
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
            (snap) => {
              void this.inCtx(async () => {
                const data = snap.exists()
                  ? (snap.data() as PipUser['profile'])
                  : undefined;

                // Keep the latest role in step even if only profile changed
                // we'll also keep the token subscription below
                const role = await this.getUserRole(user, false);

                const profile = {
                  dateOfBirth: data?.dateOfBirth ?? undefined,
                  roomNumber: data?.roomNumber ?? undefined,
                  skill: data?.skill ?? undefined,
                  vaultNumber: data?.vaultNumber ?? undefined,
                };

                this.userSubject.next(
                  PipUser.deserialize({ user, profile, role }),
                );
              });
            },
            (error) => {
              void this.inCtx(async () => {
                console.error('[AuthService] onSnapshot error:', error);
                // Keep last good value. Don't push null here
              });
            },
          );

          // Also react to claim changes while signed in (zone-safe)
          // Subscribe to AngularFire's idToken observable and decode custom claims
          this.tokenSub = this.inCtx$(() => idToken(this.auth)).subscribe(
            async (tokenStr) => {
              // Emits null on sign-out
              if (!tokenStr) return;

              const u = this.auth.currentUser;
              if (!u) return;

              // Decode base64url JWT payload safely to read custom claims (ie role)
              const role = this.getRoleFromRawToken(tokenStr);

              try {
                // Refresh profile each time, cheap, keeps model consistent
                const profile = await this.getUserProfile(u.uid);
                const next = PipUser.deserialize({ user: u, profile, role });
                this.userSubject.next(next);
              } catch (e) {
                console.error('[AuthService] idToken hydrate failed:', e);
              }
            },
          );
        });
      },
      (error) => {
        void this.inCtx(async () => {
          console.error('[AuthService] onAuthStateChanged error:', error);
          this.userSubject.next(null);
        });
      },
    );
  }

  private readonly auth = inject(Auth);
  private readonly firestore = inject(Firestore);
  private readonly env = inject(EnvironmentInjector);

  private extrasUnsub?: () => void;
  private tokenSub?: Subscription;

  private readonly userSubject = new ReplaySubject<PipUser | null>(1);

  public readonly userChanges: Observable<PipUser | null> = this.userSubject
    .asObservable()
    .pipe(shareSingleReplay<PipUser | null>());

  public readonly isLoggedInChanges: Observable<boolean> =
    this.userChanges.pipe(
      map((user) => user !== null),
      shareSingleReplay<boolean>(),
    );

  private inCtx<T>(fn: () => Promise<T>): Promise<T> {
    return runInInjectionContext(this.env, fn);
  }

  private inCtx$<T>(factory: () => Observable<T>): Observable<T> {
    return defer(() => runInInjectionContext(this.env, factory));
  }

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
    return this.inCtx(async () => {
      const user = this.auth.currentUser;
      if (!user) return;
      await sendEmailVerification(user);
    });
  }

  public signInWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return this.inCtx(() =>
      signInWithEmailAndPassword(this.auth, email, password),
    );
  }

  public signInWithGoogle(): Promise<UserCredential> {
    const provider = new GoogleAuthProvider();
    return this.inCtx(() => signInWithPopup(this.auth, provider));
  }

  public signOut(): Promise<void> {
    // Clean up listeners on sign out
    if (this.extrasUnsub) {
      this.extrasUnsub();
      this.extrasUnsub = undefined;
    }
    if (this.tokenSub) {
      this.tokenSub.unsubscribe();
      this.tokenSub = undefined;
    }
    return this.inCtx(() => signOut(this.auth));
  }

  public signUpWithEmail(
    email: string,
    password: string,
  ): Promise<UserCredential> {
    return this.inCtx(() =>
      createUserWithEmailAndPassword(this.auth, email, password),
    );
  }

  private async getUserProfile(
    uid: string,
  ): Promise<PipUser['profile'] | undefined> {
    const ref = fsDoc(this.firestore, 'users', uid);
    const snap = await fsGetDoc(ref);
    return snap.exists() ? (snap.data() as PipUser['profile']) : undefined;
  }

  private getUserRole(
    user: User,
    force: boolean,
  ): Promise<'admin' | 'user' | null> {
    return this.inCtx(async () => {
      const token = await getIdTokenResult(user, force);
      const roleClaim = token.claims['role'];
      return typeof roleClaim === 'string'
        ? (roleClaim as 'admin' | 'user')
        : null;
    });
  }

  // Decode base64url JWT payload to read custom claims (no verification - UI only)
  private getRoleFromRawToken(jwt: string): 'admin' | 'user' | null {
    try {
      const parts = jwt.split('.');
      if (parts.length < 2) return null;
      const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const json = decodeURIComponent(
        atob(b64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      const payload = JSON.parse(json) as Record<string, unknown>;
      const role = payload['role'];
      return typeof role === 'string' ? (role as 'admin' | 'user') : null;
    } catch {
      return null;
    }
  }
}
