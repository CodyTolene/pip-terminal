import { FormDirective, InputComponent } from '@proangular/pro-form';
import {
  LoginFormGroup,
  loginFormGroup,
} from 'src/app/pages/login/login-form-group';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
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
  }

  private readonly auth = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  protected override readonly formGroup = loginFormGroup;
  protected readonly userChanges = this.auth.userChanges;

  protected readonly hasLoginError = signal(false);
  protected readonly isLoggingIn = signal(false);

  protected async login(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isLoggingIn.set(true);

    const { email, password } = this.formGroup.value;
    if (!email || !password) {
      this.snackBar.open('Email and password are required.', 'Close', {
        duration: 3000,
      });
      return;
    }

    try {
      const { user } = await this.auth.signInWithEmail(email, password);
      // eslint-disable-next-line no-console
      console.log('User logged in:', user);
      this.snackBar.open(
        `Welcome, ${user.displayName || user.email}!`,
        'Close',
        { duration: 3000 },
      );
      this.hasLoginError.set(false);
    } catch (err) {
      this.hasLoginError.set(true);
      console.error('Auth error:', err);
    } finally {
      this.isLoggingIn.set(false);
    }
  }

  protected async googleLogin(): Promise<void> {
    this.isLoggingIn.set(true);

    try {
      await this.auth.signInWithGoogle();
    } catch (err) {
      console.error('Google login error:', err);
    } finally {
      this.isLoggingIn.set(false);
    }
  }
}
