import { FormDirective, InputComponent } from '@proangular/pro-form';
import { NgxCaptchaModule, ReCaptcha2Component } from 'ngx-captcha';
import {
  RegisterFormGroup,
  registerFormGroup,
} from 'src/app/pages/register/register-form-group';
import { AuthService } from 'src/app/services';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@Component({
  selector: 'pip-register-form',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    NgxCaptchaModule,
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
    if (!this.isProduction) {
      this.formGroup.controls.recaptcha.setValidators(null);
    }
  }

  private readonly auth = inject(AuthService);
  @ViewChild('captchaElem') private captchaElem?: ReCaptcha2Component;

  protected override readonly formGroup = registerFormGroup;

  protected readonly isProduction = environment.isProduction;
  protected readonly isRegistering = signal(false);
  protected readonly registerErrorMessage = signal<string | null>(null);
  protected readonly siteKey = environment.google.recaptcha.apiKey;

  protected handleExpire(): void {
    this.formGroup.controls.recaptcha.reset();
  }

  protected handleSuccess(captchaResponse: string): void {
    // eslint-disable-next-line no-console
    console.log(captchaResponse);
  }

  protected async register(): Promise<void> {
    if (this.formGroup.invalid) {
      // Touch all fields so inline messages render
      this.formGroup.markAllAsTouched();
      return;
    }

    const { email, password, recaptcha } = this.formGroup.value;
    if (!email || !password || (!recaptcha && this.isProduction)) {
      this.registerErrorMessage.set(
        'Please complete all fields and the reCAPTCHA.',
      );
      return;
    }

    this.isRegistering.set(true);
    this.registerErrorMessage.set(null);

    try {
      await this.auth.signUpWithEmail(email, password);
    } catch (err) {
      console.error('Register error:', err);
      this.registerErrorMessage.set(this.mapFirebaseError(err));

      // Force a fresh solve after any error
      this.formGroup.controls.recaptcha.reset();
      this.captchaElem?.resetCaptcha();
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
