import { CustomValidators } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface FileUploadFormGroup {
  customDirectory: FormControl<string | null>;
  dropdown: FormControl<string | null>;
  files: FormControl<FileList | null>;
}

export const fileUploadFormGroup = new FormGroup<FileUploadFormGroup>({
  customDirectory: new FormControl<string | null>(null, [
    CustomValidators.restrictSymbols(['/']),
    CustomValidators.validateDirectoryStructure,
  ]),
  dropdown: new FormControl<string | null>(null),
  files: new FormControl<FileList | null>(null, [Validators.required]),
});
