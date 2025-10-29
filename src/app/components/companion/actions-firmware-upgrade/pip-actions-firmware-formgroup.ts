import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface PipActionsFirmwareFormGroup {
  customFirmware: FormControl<string | null>;
  firmwareDropdown: FormControl<string | null>;
  skipMediaFilesCheckbox: FormControl<boolean | null>;
}

export const pipActionsFirmwareFormGroup =
  new FormGroup<PipActionsFirmwareFormGroup>({
    customFirmware: new FormControl<string | null>(null, [Validators.required]),
    firmwareDropdown: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    skipMediaFilesCheckbox: new FormControl<boolean | null>(null),
  });
