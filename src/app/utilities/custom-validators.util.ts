import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  public static validateDirectoryStructure(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;
      if (!value) return null;

      const endsWithSlash = /\/$/.test(value);
      const hasDoubleSlash = /\/{2,}/.test(value);
      const startsWithSlash = /^\//.test(value);

      if (endsWithSlash || hasDoubleSlash || startsWithSlash) {
        return {
          invalidDirectory: {
            reason:
              'Directory must not start or end with a slash or contain double slashes.',
          },
        };
      }

      return null;
    };
  }

  public static restrictSymbols(allowedChars: string[] = []): ValidatorFn {
    const escapedAllowed = allowedChars.map((char) => `\\${char}`).join('');
    const regex = new RegExp(`^[a-zA-Z0-9_\\-\\${escapedAllowed}]+$`);

    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value as string | null;
      if (!value) return null;

      const segments = value.split('/');
      for (const segment of segments) {
        if (!regex.test(segment)) {
          return {
            invalidCharacters: {
              reason:
                'Only letters, numbers, underscores, hyphens' +
                `${
                  allowedChars.length ? `, and ${allowedChars.join(', ')}` : ''
                } are allowed.`,
            },
          };
        }
      }

      return null;
    };
  }
}
