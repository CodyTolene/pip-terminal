import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface RegisterFormGroup {
  displayName: FormControl<string>;
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
  terms: FormControl<boolean>;
}

export const registerFormGroup = new FormGroup<RegisterFormGroup>(
  {
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(Validation.user.displayName.regExp),
        Validators.minLength(Validation.user.displayName.minLength),
        Validators.maxLength(Validation.user.displayName.maxLength),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(Validation.user.email.minLength),
        Validators.maxLength(Validation.user.email.maxLength),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(Validation.user.password.minLength),
        Validators.maxLength(Validation.user.password.maxLength),
      ],
    }),
    passwordConfirm: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    terms: new FormControl(false, {
      nonNullable: true,
      validators: [Validators.requiredTrue],
    }),
  },
  { validators: Validation.passwordMatchValidator },
);
