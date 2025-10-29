/* eslint-disable no-console */
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {
  FormDirective,
  InputCheckboxComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { isNonEmptyValue } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipActionsFirmwareFormGroup,
  pipActionsFirmwareFormGroup,
} from 'src/app/components/companion/actions-firmware-upgrade/pip-actions-firmware-formgroup';
import { PipFileUploadComponent } from 'src/app/components/file-upload/file-upload.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@UntilDestroy()
@Component({
  selector: 'pip-actions-firmware-upgrade',
  templateUrl: './pip-actions-firmware-upgrade.component.html',
  styleUrl: './pip-actions-firmware-upgrade.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputCheckboxComponent,
    InputDropdownComponent,
    InputDropdownOptionComponent,
    MatProgressBarModule,
    PipButtonComponent,
    PipFileUploadComponent,
    PipTitleComponent,
    ReactiveFormsModule,
  ],
})
export class PipActionsFirmwareUpgradeComponent
  extends FormDirective<PipActionsFirmwareFormGroup>
  implements OnInit
{
  protected readonly releases = releases;

  protected override readonly formGroup = pipActionsFirmwareFormGroup;

  protected readonly isUpgrading = signal(false);

  public ngOnInit(): void {
    this.formGroup.valueChanges.pipe(untilDestroyed(this)).subscribe(() => {
      this.updateFormControlState();
    });
  }

  public async onClearCustomFirmwareClick(): Promise<void> {
    this.formGroup.controls.customFirmware.setValue(null);
  }

  public async onUpgradeClick(): Promise<void> {
    if (this.formGroup.invalid) {
      this.highlightInvalidControls();
      this.scrollToFirstInvalidControl();
      return;
    }
  }

  private updateFormControlState(): void {
    const useOfficialFirmware = isNonEmptyValue(
      this.formGroup.controls.firmwareDropdown.value,
    );

    if (useOfficialFirmware) {
      this.formGroup.controls.customFirmware.setValue(null, {
        emitEvent: false,
      });
      this.formGroup.controls.customFirmware.disable({ emitEvent: false });
      console.log('Using official firmware');
      return;
    } else {
      this.formGroup.controls.customFirmware.enable({ emitEvent: false });
    }

    const userCustomFirmware = isNonEmptyValue(
      this.formGroup.controls.customFirmware.value,
    );
    if (userCustomFirmware) {
      this.formGroup.controls.firmwareDropdown.setValue(null, {
        emitEvent: false,
      });
      this.formGroup.controls.firmwareDropdown.disable({ emitEvent: false });
      console.log('Using unofficial firmware');
      return;
    } else {
      this.formGroup.controls.firmwareDropdown.enable({ emitEvent: false });
    }
  }
}

const releases = [
  {
    label: '2v24.206-0.20',
    // No longer available remotely.
    url: 'firmware/release_2v24.206-0.20.zip',
  },
  {
    label: '2v24.413-1.12',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v24.413-1.12.zip'
      : 'firmware/release_2v24.413-1.12.zip', // Use this in prod if not available remotely
  },
  {
    label: '2v25.284-1.24',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v25.284-1.24.zip'
      : 'firmware/release_2v25.284-1.24.zip', // Use this in prod if not available remotely
  },
  {
    label: '2v25.359-1.29',
    url: environment.isProduction
      ? 'https://thewandcompany.com/pip-boy/upgrade/release_2v25.359-1.29.zip'
      : 'firmware/release_2v25.359-1.29.zip', // Use this in prod if not available remotely
  },
];
