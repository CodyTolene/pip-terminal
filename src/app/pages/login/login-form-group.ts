import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface LoginFormGroup {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

export const loginFormGroup = new FormGroup<LoginFormGroup>({
  email: new FormControl<string | null>(null, [
    Validators.email,
    Validators.required,
    Validators.minLength(Validation.user.email.minLength),
    Validators.maxLength(Validation.user.email.maxLength),
  ]),
  password: new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(Validation.user.password.minLength),
    Validators.maxLength(Validation.user.password.maxLength),
  ]),
});
