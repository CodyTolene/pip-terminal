import { DateTime } from 'luxon';
import { isNonEmptyValue } from 'src/app/utilities';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateTime', standalone: true })
export class DateTimePipe implements PipeTransform {
  private readonly defaultFormat: DateTimeFormat = 'MM/dd/yyyy';

  /**
   * Transforms a DateTime object into a formatted string for display.
   *
   * @param value The value to transform.
   * @returns The transformed value as a string.
   */
  public transform(
    value: DateTime | null | undefined | unknown,
    format: DateTimeFormat = this.defaultFormat,
  ): string {
    if (!isNonEmptyValue(value) || !(value instanceof DateTime)) {
      return '';
    }
    return value.toFormat(format);
  }
}
