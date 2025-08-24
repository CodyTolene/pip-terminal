import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputCheckboxComponent,
  InputComponent,
} from '@proangular/pro-form';
import { distinctUntilChanged } from 'rxjs';
import {
  RegisterFormGroup,
  registerFormGroup,
} from 'src/app/pages/register/register-form-group';
import { PAGES } from 'src/app/routing';
import { AuthService, UserProfileService } from 'src/app/services';
import { isNonEmptyString } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, effect, inject, signal } from '@angular/core';
import { FirebaseError } from '@angular/fire/app';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

@UntilDestroy()
@Component({
  selector: 'pip-register-form',
  standalone: true,
  imports: [
    CommonModule,
    InputCheckboxComponent,
    InputComponent,
    PipButtonComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
})
export class RegisterFormComponent
  extends FormDirective<RegisterFormGroup>
  implements OnInit
{
  public constructor() {
    super();

    this.formGroup.reset();

    effect(() => {
      const isRegistering = this.isRegistering();
      if (isRegistering) {
        this.formGroup.controls.displayName.disable({ emitEvent: false });
        this.formGroup.controls.email.disable({ emitEvent: false });
        this.formGroup.controls.password.disable({ emitEvent: false });
        this.formGroup.controls.terms.disable({ emitEvent: false });
      } else {
        this.formGroup.controls.displayName.enable({ emitEvent: false });
        this.formGroup.controls.email.enable({ emitEvent: false });
        this.formGroup.controls.password.enable({ emitEvent: false });
        this.formGroup.controls.terms.enable({ emitEvent: false });
      }
    });
  }

  private readonly auth = inject(AuthService);
  private readonly userProfile = inject(UserProfileService);

  protected override readonly formGroup = registerFormGroup;

  protected readonly isProduction = environment.isProduction;
  protected readonly isRegistering = signal(false);
  protected readonly registerErrorMessage = signal<string | null>(null);

  protected readonly termsAndConditionsUrl: PageUrl =
    PAGES['Terms and Conditions'];

  public ngOnInit(): void {
    const displayNameCtrl = this.formGroup.controls.displayName;
    const emailCtrl = registerFormGroup.controls.email;

    emailCtrl.valueChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((val) => {
        const trimmed = val.trim();
        if (val !== trimmed) {
          emailCtrl.setValue(trimmed, { emitEvent: false });
        }
      });

    displayNameCtrl.valueChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((val) => {
        const trimmed = val.trim();
        if (val !== trimmed) {
          displayNameCtrl.setValue(trimmed, { emitEvent: false });
        }
      });
  }

  protected async register(): Promise<void> {
    if (this.formGroup.invalid) {
      // Touch all fields so inline messages render
      this.formGroup.markAllAsTouched();
      return;
    }

    const { displayName, email, password, terms } = this.formGroup.value;
    if (
      !isNonEmptyString(email) ||
      !isNonEmptyString(password) ||
      !terms ||
      !isNonEmptyString(displayName)
    ) {
      this.registerErrorMessage.set('Please complete all fields.');
      return;
    }

    this.isRegistering.set(true);
    this.registerErrorMessage.set(null);

    try {
      const cred = await this.auth.signUpWithEmail(email, password);
      // await this.auth.sendEmailVerification(); // Re-enable if they don't auto-send.
      // Once sign up is successful, immediately update their selected displayName
      await this.userProfile.updateDisplayName(
        cred.user.uid,
        displayName.trim(),
      );
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
