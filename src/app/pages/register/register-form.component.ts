import { FormDirective, InputComponent } from '@proangular/pro-form';
import {
  RegisterFormGroup,
  registerFormGroup,
} from 'src/app/pages/register/register-form-group';
import { AuthService } from 'src/app/services';

import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';

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
  private readonly snackBar = inject(MatSnackBar);

  protected override readonly formGroup = registerFormGroup;

  protected readonly hasRegisterError = signal(false);
  protected readonly isRegistering = signal(false);

  protected async register(): Promise<void> {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }

    this.isRegistering.set(true);

    const { email, password } = this.formGroup.value;
    if (!email || !password) {
      this.snackBar.open('Email and password are required.', 'Close', {
        duration: 3000,
      });
      return;
    }

    try {
      await this.auth.signUpWithEmail(email, password);
      this.hasRegisterError.set(false);
    } catch (err) {
      this.hasRegisterError.set(true);
      this.snackBar.open('Registration failed. Please try again.', 'Close', {
        duration: 3000,
      });
      console.error('Register error:', err);
    } finally {
      this.isRegistering.set(false);
    }
  }
}
