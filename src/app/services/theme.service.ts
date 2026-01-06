import { ReplaySubject } from 'rxjs';
import { ThemeEnum } from 'src/app/enums';

import { Injectable, inject } from '@angular/core';

import { StorageLocalService } from 'src/app/services/storage-local.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storage = inject(StorageLocalService);

  private readonly defaultTheme = ThemeEnum.SCAN_LINES;

  public currentThemeChanges = new ReplaySubject<ThemeEnum>(1);

  public init(): void {
    this.setInitialTheme();
  }

  public setTheme(theme: ThemeEnum): void {
    this.currentThemeChanges.next(theme);
    const body = document.body;
    body.classList.remove(...Object.values(ThemeEnum));
    body.classList.add(theme);
    this.storage.set('theme', theme);
  }

  /**
   * Set the initial theme on app start. This will attempt to load the users
   * previously selected theme from local storage, otherwise it will use the
   * default theme.
   */
  private setInitialTheme(): void {
    const theme = this.storage.get<ThemeEnum>('theme');
    this.setTheme(theme ?? this.defaultTheme);
  }
}
