import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface PipActionsFirmwareFormGroup {
  customFirmware: FormControl<string | null>;
  eraseSdCardCheckbox: FormControl<boolean | null>;
  firmwareDropdown: FormControl<string | null>;
  skipMediaFilesCheckbox: FormControl<boolean | null>;
}

export const pipActionsFirmwareFormGroup =
  new FormGroup<PipActionsFirmwareFormGroup>({
    customFirmware: new FormControl<string | null>(null, [Validators.required]),
    eraseSdCardCheckbox: new FormControl<boolean | null>(null),
    firmwareDropdown: new FormControl<string | null>(null, [
      Validators.required,
    ]),
    skipMediaFilesCheckbox: new FormControl<boolean | null>(null),
  });
