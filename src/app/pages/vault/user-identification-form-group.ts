import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface UserIdentificationFormGroup {
  displayName: FormControl<string>;
  vaultNumber: FormControl<number | null>;
}

const v = {
  email: { minLength: 6, maxLength: 320 },
  password: { minLength: 6, maxLength: 128 },
  username: { minLength: 2, maxLength: 128 },
};

const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/;

export const userIdentificationFormGroup =
  new FormGroup<UserIdentificationFormGroup>({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(USERNAME_REGEX),
        Validators.minLength(v.username.minLength),
        Validators.maxLength(v.username.maxLength),
      ],
    }),
    vaultNumber: new FormControl<number | null>(null, Validators.required),
  });
