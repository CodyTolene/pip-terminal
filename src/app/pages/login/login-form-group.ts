import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface LoginFormGroup {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

const loginFormGroupValidation = {
  password: {
    maxLength: 20,
    minLength: 8,
  },
};

const validation = loginFormGroupValidation;

export const loginFormGroup = new FormGroup<LoginFormGroup>({
  email: new FormControl<string | null>(null, [
    Validators.email,
    Validators.required,
  ]),
  password: new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(validation.password.minLength),
    Validators.maxLength(validation.password.maxLength),
  ]),
});
