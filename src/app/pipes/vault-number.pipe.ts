import { Pipe, PipeTransform } from '@angular/core';

import { Validation } from 'src/app/utilities/validation.util';

@Pipe({ name: 'vaultNumber', standalone: true })
export class VaultNumberPipe implements PipeTransform {
  public transform(value: number | null): number | string {
    if (
      value !== null &&
      value >= Validation.profile.vaultNumber.min &&
      value <= Validation.profile.vaultNumber.max
    ) {
      return value;
    }
    return '';
  }
}
