import { signal } from '@angular/core';

export const isEditModeSignal = signal<boolean>(false);

export const isSavingSignal = signal<boolean>(false);
