import { FormDirective, InputComponent } from '@proangular/pro-form';
import {
  RegisterFormGroup,
  registerFormGroup,
} from 'src/app/pages/register/register-form-group';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-register-form',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    PipButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent extends FormDirective<RegisterFormGroup> {
  public constructor() {
    super();
    this.formGroup.reset();
  }

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected override readonly formGroup = registerFormGroup;

  protected readonly isRegistering = signal(false);
  protected readonly registerErrorMessage = signal<string | null>(null);

  protected async register(): Promise<void> {
    if (this.formGroup.invalid) {
      // Touch all fields so inline messages render
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password } = this.formGroup.value;

    if (!email || !password) {
      this.registerErrorMessage.set('Email and password are required.');
      return;
    }

    this.isRegistering.set(true);
    this.registerErrorMessage.set(null);

    try {
      await this.auth.signUpWithEmail(email, password);
      this.registerErrorMessage.set(null);
      // this.router.navigate(['']);
    } catch (err) {
      console.error('Register error:', err);
      this.registerErrorMessage.set(this.mapFirebaseError(err));
    } finally {
      this.isRegistering.set(false);
    }
  }

  private mapFirebaseError(err: unknown): string {
    const fallback = 'Registration failed. Please try again in a moment.';
    if (!(err as FirebaseError)?.code) {
      return fallback;
    }

    const code = (err as FirebaseError).code;

    switch (code) {
      case 'auth/email-already-in-use':
        return 'That email is already registered. Try signing in or using a different email address.';
      case 'auth/invalid-email':
        return 'The email address is invalid. Check for typos.';
      case 'auth/weak-password':
        return 'Your password is too weak. Use 8-20 characters with letters and numbers.';
      case 'auth/operation-not-allowed':
        return 'Registration down, please try again later.';
      case 'auth/network-request-failed':
        return 'Network problem. Check your connection and try again.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a bit and try again.';
      default:
        return fallback;
    }
  }
}
