import { fromSecondsToMilliseconds } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly snackBar = inject(MatSnackBar);

  public error({
    dismissLabel = 'Dismiss',
    durationSecs = 5,
    keepOpen = false,
    message = 'An unknown issue occurred, please try again or contact support.',
  }: Partial<ToastData>): void {
    this.snackBar.open(message, dismissLabel, {
      duration: keepOpen ? undefined : fromSecondsToMilliseconds(durationSecs),
      horizontalPosition: 'center',
      panelClass: 'toast-error',
      verticalPosition: 'top',
    });
  }

  public success({
    dismissLabel = 'Dismiss',
    durationSecs = 5,
    keepOpen = false,
    message = 'Success!',
  }: Partial<ToastData>): void {
    this.snackBar.open(message, dismissLabel, {
      duration: keepOpen ? undefined : fromSecondsToMilliseconds(durationSecs),
      horizontalPosition: 'center',
      panelClass: 'toast-success',
      verticalPosition: 'top',
    });
  }
}

interface ToastData {
  /** Label to display for the dismiss button. */
  dismissLabel: string;
  /** Duration in seconds. */
  durationSecs: number;
  /** Keep open until the user dismisses it. */
  keepOpen: boolean;
  /** The message to display in the toast. */
  message: string;
}
