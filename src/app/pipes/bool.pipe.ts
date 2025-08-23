import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { Pipe, PipeTransform } from '@angular/core';

/**
 * Transforms a boolean value to a 'True' or 'False' string.
 */
@Pipe({ name: 'bool' })
export class BoolPipe implements PipeTransform {
  public transform(value: object | unknown, lowercase?: boolean): string {
    const yesNo = coerceBooleanProperty(value) ? 'True' : 'False';
    return lowercase ? yesNo.toLowerCase() : yesNo;
  }
}
