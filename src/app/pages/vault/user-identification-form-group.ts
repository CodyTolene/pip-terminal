import { CustomValidators } from '@proangular/pro-form';
import { DateTime } from 'luxon';
import { Validation } from 'src/app/utilities';

import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface UserIdentificationFormGroup {
  dateOfBirth: FormControl<DateTime | null>;
  displayName: FormControl<string>;
  roomNumber: FormControl<number | null>;
  skill: FormControl<string | null>;
  vaultNumber: FormControl<number | null>;
}

export const userIdentificationFormGroup =
  new FormGroup<UserIdentificationFormGroup>({
    dateOfBirth: new FormControl<DateTime | null>(null, [
      // Today
      CustomValidators.minDateTime(Validation.profile.dateOfBirth.minDateTime),
      // 1900-01-01
      CustomValidators.maxDateTime(Validation.profile.dateOfBirth.maxDateTime),
    ]),
    displayName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.pattern(Validation.user.displayName.regExp),
        Validators.minLength(Validation.user.displayName.minLength),
        Validators.maxLength(Validation.user.displayName.maxLength),
      ],
    }),
    roomNumber: new FormControl<number | null>(null, [
      Validators.min(Validation.profile.roomNumber.min),
      Validators.max(Validation.profile.roomNumber.max),
    ]),
    skill: new FormControl<string | null>(null, [
      Validators.minLength(Validation.profile.skill.minLength),
      Validators.maxLength(Validation.profile.skill.maxLength),
    ]),
    vaultNumber: new FormControl<number | null>(null, [
      Validators.min(Validation.profile.vaultNumber.min),
      Validators.max(Validation.profile.vaultNumber.max),
    ]),
  });
