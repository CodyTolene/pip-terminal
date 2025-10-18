import { FirebaseError } from '@firebase/app';
import { FormDirective, InputComponent } from '@proangular/pro-form';
import { AuthService, ToastService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PageUrl } from 'src/app/types/page-url';

import {
  ForgotPasswordFormGroup,
  forgotPasswordFormGroup,
} from './forgot-password-form-group';

@Component({
  selector: 'pip-forgot-password-form',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    PipButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './forgot-password-form.component.html',
  styleUrls: ['./forgot-password-form.component.scss'],
})
export class ForgotPasswordFormComponent extends FormDirective<ForgotPasswordFormGroup> {
  public constructor() {
    super();

    this.formGroup.reset();
  }

  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  protected override readonly formGroup = forgotPasswordFormGroup;

  protected readonly isSubmitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);

  protected readonly loginUrl = '/' + ('login' satisfies PageUrl);

  protected async submit(): Promise<void> {
    if (this.formGroup.invalid) {
      this.highlightInvalidControls();
      this.scrollToFirstInvalidControl();
      return;
    }

    const { email } = this.formGroup.value;
    if (!email) {
      this.errorMessage.set('Email is required.');
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    try {
      await this.auth.sendPasswordResetEmail(email);
      this.toast.success({
        message: 'Password reset email sent. Please check your inbox.',
        durationSecs: 4,
      });
      this.successMessage.set(
        'Password reset email sent. Please check your inbox.',
      );
    } catch (err) {
      console.error('Password reset error:', err);
      this.errorMessage.set(this.mapFirebaseError(err));
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private mapFirebaseError(err: unknown): string {
    const fallback = 'Reset password failed. Please try again in a moment.';
    const code = (err as FirebaseError)?.code;
    switch (code) {
      case 'auth/user-not-found':
        return 'If your email is registered, you will receive a password reset email.';
      case 'auth/invalid-email':
        return 'The email address is invalid. Check for typos.';
      case 'auth/user-disabled':
        return 'This account is disabled. Contact support if this is unexpected.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please wait a bit and try again.';
      case 'auth/network-request-failed':
        return 'Network problem. Check your connection and try again.';
      default:
        return fallback;
    }
  }
}
