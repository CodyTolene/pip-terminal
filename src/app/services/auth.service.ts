import { Observable, ReplaySubject, map } from 'rxjs';
import { shareSingleReplay } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import {
  Auth,
  GoogleAuthProvider,
  User,
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public constructor() {
    try {
      this.auth.onAuthStateChanged(
        (user) => {
          this.userSubject.next(user);
        },
        (error) => {
          console.error('[AuthService] onAuthStateChanged error:', error);
          this.userSubject.next(null);
        },
      );
    } catch (err) {
      console.error('[AuthService] Failed to init auth listener:', err);
      this.userSubject.next(null);
    }
  }

  private readonly auth = inject(Auth);

  private readonly userSubject = new ReplaySubject<User | null>(1);

  public readonly userChanges: Observable<User | null> = this.userSubject
    .asObservable()
    .pipe(shareSingleReplay<User | null>());

  public readonly isLoggedInChanges: Observable<boolean> =
    this.userChanges.pipe(
      map((user) => user !== null),
      shareSingleReplay<boolean>(),
    );

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
    return signOut(this.auth);
  }

  public getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    return currentUser ? currentUser.getIdToken() : Promise.resolve(null);
  }
}
