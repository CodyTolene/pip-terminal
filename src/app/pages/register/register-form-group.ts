import { distinctUntilChanged } from 'rxjs';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface RegisterFormGroup {
  email: FormControl<string>;
  password: FormControl<string>;
  terms: FormControl<boolean>;
  username: FormControl<string>;
}

const v = {
  email: { minLength: 6, maxLength: 320 },
  password: { minLength: 6, maxLength: 128 },
  username: { minLength: 2, maxLength: 128 },
};

const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/;

export const registerFormGroup = new FormGroup<RegisterFormGroup>({
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
  terms: new FormControl(false, {
    nonNullable: true,
    validators: [Validators.requiredTrue],
  }),
  username: new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.pattern(USERNAME_REGEX),
      Validators.minLength(v.username.minLength),
      Validators.maxLength(v.username.maxLength),
    ],
  }),
});

// Auto-trim email and username so validators run on trimmed values
const emailCtrl = registerFormGroup.controls.email;
emailCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
  const trimmed = val.trim();
  if (val !== trimmed) emailCtrl.setValue(trimmed, { emitEvent: false });
});

const usernameCtrl = registerFormGroup.controls.username;
usernameCtrl.valueChanges.pipe(distinctUntilChanged()).subscribe((val) => {
  const trimmed = val.trim();
  if (val !== trimmed) usernameCtrl.setValue(trimmed, { emitEvent: false });
});
