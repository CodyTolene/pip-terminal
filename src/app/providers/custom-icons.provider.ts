import {
  EnvironmentProviders,
  inject,
  provideEnvironmentInitializer,
} from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { IconCustomName } from 'src/app/types/icon-custom-name';

export function customIconsProvider(
  iconCustomNames: readonly IconCustomName[],
): EnvironmentProviders {
  return provideEnvironmentInitializer(() => {
    const registry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);

    for (const iconCustomName of iconCustomNames) {
      registry.addSvgIcon(
        iconCustomName,
        sanitizer.bypassSecurityTrustResourceUrl(
          `images/icons/${iconCustomName}.svg`,
        ),
      );
    }
  });
}
