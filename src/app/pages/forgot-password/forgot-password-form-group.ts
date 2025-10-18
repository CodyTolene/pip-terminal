import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface ForgotPasswordFormGroup {
  email: FormControl<string | null>;
}

export const forgotPasswordFormGroup = new FormGroup<ForgotPasswordFormGroup>({
  email: new FormControl<string | null>(null, [
    Validators.required,
    Validators.email,
    Validators.minLength(Validation.user.email.minLength),
    Validators.maxLength(Validation.user.email.maxLength),
  ]),
});
