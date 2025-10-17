import { DateTime } from 'luxon';
import { MarkupService } from 'src/app/services';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class Validation {
  public static readonly forum = {
    comment: {
      content: {
        minLength: 1,
        maxLength: 2048,
      },
    },
    post: {
      contentHtml: {
        minLength: 1,
        maxLength: 4096,
      },
      title: {
        minLength: 1,
        maxLength: 256,
      },
    },
  };

  public static readonly profile = {
    dateOfBirth: {
      minDateTime: DateTime.fromISO('1900-01-01'),
      maxDateTime: DateTime.local().startOf('day'),
    },
    roomNumber: {
      min: 1,
      max: 999,
    },
    skill: {
      minLength: 2,
      maxLength: 128,
    },
    vaultNumber: {
      min: 1,
      max: 999,
    },
  };

  public static readonly user = {
    displayName: {
      minLength: 2,
      maxLength: 128,
      regExp: /^[A-Za-z0-9._-]+$/,
    },
    email: {
      minLength: 6,
      maxLength: 320,
    },
    password: {
      minLength: 6,
      maxLength: 128,
    },
  };

  public static passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }

  public static maxVisibleCharsFromHtmlValidator(
    limit: number,
    markup: MarkupService,
    imageWeight = 0,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const html: string = control.value ?? '';
      const text = markup.countVisibleChars(html, imageWeight);
      return text <= limit ? null : { maxVisibleChars: { limit } };
    };
  }
}
