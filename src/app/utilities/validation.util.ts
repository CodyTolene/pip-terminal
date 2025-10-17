import { DateTime } from 'luxon';
import { MarkupService } from 'src/app/services';

import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import {
  dataUrlMime,
  extractImageBytes,
  isDataUrl,
  isFileOrBlob,
} from 'src/app/utilities/images.util';

export class Validation {
  public static readonly maxImageSizeBytes = 2 * 1024 * 1024; // 2 MB

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

  /**
   * Validator that enforces `image/*` content type.
   * Accepts File/Blob, or a data URL like "data:image/png;base64,...".
   */
  public static imageContentTypeValidator(
    allowed = /^image\/.+$/i,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null) {
        return null;
      }

      if (isFileOrBlob(v)) {
        const type = (v as Blob).type || '';
        return allowed.test(type)
          ? null
          : { imageBadType: { allowed: allowed.source || String(allowed) } };
      }

      if (typeof v === 'string' && isDataUrl(v)) {
        const mime = dataUrlMime(v);
        return allowed.test(mime)
          ? null
          : { imageBadType: { allowed: allowed.source || String(allowed) } };
      }

      return null;
    };
  }

  /**
   * Creates a ValidatorFn that ensures a control's value represents a valid
   * image file based on MIME type and maximum size.
   */
  public static imageFileValidator(opts?: {
    allowed?: RegExp;
    maxBytes?: number;
  }): ValidatorFn {
    const allowed = opts?.allowed ?? /^image\/.+$/i;
    const maxBytes = opts?.maxBytes ?? Validation.maxImageSizeBytes;

    const typeValidator = Validation.imageContentTypeValidator(allowed);
    const sizeValidator = Validation.imageMaxBytesLtValidator(maxBytes);

    return (control: AbstractControl): ValidationErrors | null => {
      const typeErr = typeValidator(control);
      if (typeErr) return typeErr;
      return sizeValidator(control);
    };
  }

  /**
   * Creates a reactive-form validator that ensures an image's byte size is
   *  strictly less than a specified maximum.
   */
  public static imageMaxBytesLtValidator(
    maxBytes = Validation.maxImageSizeBytes,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value;
      if (v === null) {
        return null;
      }

      const size = extractImageBytes(v);
      if (size === null) {
        return null;
      }

      return size < maxBytes
        ? null
        : { imageTooLarge: { maxBytes, actualBytes: size } };
    };
  }

  /**
   * Validates visible character count extracted from HTML, optionally weighting
   * images. Keeps parity with "images count as N chars" UX in the editor.
   */
  public static maxVisibleCharsFromHtmlValidator(
    limit: number,
    markup: MarkupService,
    imageWeight = 0,
  ): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const html: string = control.value ?? '';
      const count = markup.countVisibleChars(html, imageWeight);
      return count <= limit ? null : { maxVisibleChars: { limit } };
    };
  }

  /**
   * Ensures password and passwordConfirm fields match inside a FormGroup.
   */
  public static passwordMatchValidator(
    control: AbstractControl,
  ): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;
    return password === passwordConfirm ? null : { passwordMismatch: true };
  }
}
