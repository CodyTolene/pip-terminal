import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputRadioComponent,
  InputRadioOptionComponent,
} from '@proangular/pro-form';
import { distinctUntilChanged } from 'rxjs';
import { APP_VERSION } from 'src/app/constants';
import { ThemeEnum } from 'src/app/enums';
import {
  ThemeFormGroup,
  themeFormGroup,
} from 'src/app/layout/footer/theme-form-group';
import { ThemeService } from 'src/app/services';

import { Component, OnInit, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@UntilDestroy()
@Component({
  selector: 'pip-footer',
  templateUrl: './footer.component.html',
  imports: [
    InputRadioComponent,
    InputRadioOptionComponent,
    FormsModule,
    ReactiveFormsModule,
  ],
  styleUrl: './footer.component.scss',
  providers: [],
  standalone: true,
})
export class PipFooterComponent
  extends FormDirective<ThemeFormGroup>
  implements OnInit
{
  private readonly themeService = inject(ThemeService);

  protected override formGroup = themeFormGroup;
  protected readonly ThemeEnum = ThemeEnum;
  protected readonly versionNumber = APP_VERSION;

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
