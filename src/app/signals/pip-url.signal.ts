import { PipUrlsEnum } from 'src/app/enums';

import { signal } from '@angular/core';

export const pipUrlSignal = signal<PipUrlsEnum | null>(null);
