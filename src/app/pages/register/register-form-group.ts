import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface RegisterFormGroup {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
  terms: FormControl<boolean | null>;
}

const registerFormGroupValidation = {
  password: {
    maxLength: 20,
    minLength: 8,
  },
};

const validation = registerFormGroupValidation;

export const registerFormGroup = new FormGroup<RegisterFormGroup>({
  email: new FormControl<string | null>(null, [
    Validators.email,
    Validators.required,
  ]),
  password: new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(validation.password.minLength),
    Validators.maxLength(validation.password.maxLength),
  ]),
  terms: new FormControl<boolean | null>(false, [Validators.required]),
});
