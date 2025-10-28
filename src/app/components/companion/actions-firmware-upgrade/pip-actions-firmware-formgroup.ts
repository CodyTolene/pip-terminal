import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface PipActionsFirmwareFormGroup {
  firmwareDropdown: FormControl<string | null>;
  skipMediaFilesCheckbox: FormControl<boolean | null>;
}

export const pipActionsFirmwareFormGroup =
  new FormGroup<PipActionsFirmwareFormGroup>({
    firmwareDropdown: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    skipMediaFilesCheckbox: new FormControl<boolean | null>(null),
  });
