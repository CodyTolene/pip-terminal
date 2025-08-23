import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface UserIdentificationFormGroup {
  displayName: FormControl<string | null>;
  vaultNumber: FormControl<number | null>;
}

export const userIdentificationFormGroup =
  new FormGroup<UserIdentificationFormGroup>({
    displayName: new FormControl<string | null>(null, Validators.required),
    vaultNumber: new FormControl<number | null>(null, Validators.required),
  });
