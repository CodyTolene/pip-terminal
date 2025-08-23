import { distinctUntilChanged } from 'rxjs';

import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';

export interface RegisterFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
  passwordConfirm: FormControl<string>;
  terms: FormControl<boolean>;
}

const v = {
  email: { minLength: 6, maxLength: 320 },
  password: { minLength: 6, maxLength: 128 },
};

function passwordMatchValidator(
  control: AbstractControl,
): ValidationErrors | null {
  const password = control.get('password')?.value;
  const passwordConfirm = control.get('passwordConfirm')?.value;
  return password === passwordConfirm ? null : { passwordMismatch: true };
}

export const registerFormGroup = new FormGroup<RegisterFormGroup>(
  {
    email: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.email,
        Validators.minLength(v.email.minLength),
        Validators.maxLength(v.email.maxLength),
      ],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(v.password.minLength),
        Validators.maxLength(v.password.maxLength),
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
  { validators: passwordMatchValidator },
);

// Auto-trim email so validators run on trimmed values
const emailCtrl = registerFormGroup.controls.email;
emailCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
  const trimmed = val.trim();
  if (val !== trimmed) emailCtrl.setValue(trimmed, { emitEvent: false });
});
