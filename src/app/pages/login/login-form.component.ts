import { FirebaseError } from '@firebase/app';
import { FormDirective, InputComponent } from '@proangular/pro-form';
import {
  LoginFormGroup,
  loginFormGroup,
} from 'src/app/pages/login/login-form-group';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-login-form',
  imports: [
    CommonModule,
    InputComponent,
    PipButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  standalone: true,
})
export class LoginFormComponent extends FormDirective<LoginFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();

    effect(() => {
      const isLoggingIn = this.isLoggingIn();
      if (isLoggingIn) {
        this.formGroup.controls.email.disable({ emitEvent: false });
        this.formGroup.controls.password.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.email.enable({ emitEvent: false });
        this.formGroup.controls.password.enable({ emitEvent: false });
      }
    });
  }

  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected override readonly formGroup = loginFormGroup;
  protected readonly isLoggingIn = signal(false);
  protected readonly loginErrorMessage = signal<string | null>(null);
  protected readonly userChanges = this.auth.userChanges;

  private mapFirebaseError(err: unknown): string {
    const fallback = 'Sign in failed. Please try again in a moment.';
    const code = (err as FirebaseError)?.code;

    // Avoid account enumeration: collapse credential errors to one message
    if (
      code === 'auth/invalid-credential' ||
      code === 'auth/wrong-password' ||
      code === 'auth/user-not-found'
    ) {
      return 'Email or password is incorrect.';
    }

    switch (code) {
      case 'auth/invalid-email':
        return 'The email address is invalid. Check for typos.';
      case 'auth/user-disabled':
        return 'This account is disabled. Contact support if this is unexpected.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a bit and try again.';
      case 'auth/network-request-failed':
        return 'Network problem. Check your connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Google sign in was closed before completing.';
      default:
        return fallback;
    }
  }

  protected async login(): Promise<void> {
    if (this.formGroup.invalid) {
      // Touch all fields so inline messages render
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password } = this.formGroup.value;
    if (!email || !password) {
      this.loginErrorMessage.set('Email and password are required.');
      return;
    }

    this.isLoggingIn.set(true);
    this.loginErrorMessage.set(null);

    try {
      const { user } = await this.auth.signInWithEmail(email, password);
      this.snackBar.open(
        `Welcome, ${user.displayName || user.email}!`,
        'Close',
        { duration: 3000 },
      );
      this.loginErrorMessage.set(null);
      // Routing will be handled from here in the parent page component.
    } catch (err) {
      console.error('Auth error:', err);
      this.loginErrorMessage.set(this.mapFirebaseError(err));
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  protected async googleLogin(): Promise<void> {
    this.isLoggingIn.set(true);
    this.loginErrorMessage.set(null);

    try {
      await this.auth.signInWithGoogle();
    } catch (err) {
      console.error('Google login error:', err);
      this.loginErrorMessage.set(this.mapFirebaseError(err));
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
