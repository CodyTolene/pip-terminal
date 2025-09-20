import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputRadioComponent,
  InputRadioOptionComponent,
} from '@proangular/pro-form';
import { distinctUntilChanged } from 'rxjs';
import { ThemeEnum } from 'src/app/enums';
import { ThemeService } from 'src/app/services';

import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import {
  ThemeFormGroup,
  themeFormGroup,
} from 'src/app/components/theme-selector/theme-form-group';

@UntilDestroy()
@Component({
  selector: 'pip-theme-selector',
  templateUrl: './theme-selector.component.html',
  imports: [
    InputRadioComponent,
    InputRadioOptionComponent,
    ReactiveFormsModule,
  ],
  providers: [],
  standalone: true,
})
export class ThemeSelectorComponent
  extends FormDirective<ThemeFormGroup>
  implements OnInit
{
  private readonly themeService = inject(ThemeService);

  protected override formGroup = themeFormGroup;
  protected readonly ThemeEnum = ThemeEnum;

  public ngOnInit(): void {
    this.themeService.currentThemeChanges
      .pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((theme) => {
        this.formGroup.controls.theme.setValue(theme);
      });

    this.formGroup.controls.theme.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe((theme) => {
        if (theme) {
          this.themeService.setTheme(theme);
        }
      });
  }
}
