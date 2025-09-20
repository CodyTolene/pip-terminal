import { ThemeEnum } from 'src/app/enums';

import { FormControl, FormGroup } from '@angular/forms';

export interface ThemeFormGroup {
  theme: FormControl<ThemeEnum | null>;
}

export const themeFormGroup = new FormGroup<ThemeFormGroup>({
  theme: new FormControl<ThemeEnum | null>(null),
});
