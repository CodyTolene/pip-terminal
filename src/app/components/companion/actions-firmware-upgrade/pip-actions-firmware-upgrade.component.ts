import {
  FormDirective,
  InputCheckboxComponent,
  InputDropdownComponent,
  InputDropdownOptionComponent,
} from '@proangular/pro-form';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import {
  PipActionsFirmwareFormGroup,
  pipActionsFirmwareFormGroup,
} from 'src/app/components/companion/actions-firmware-upgrade/pip-actions-firmware-formgroup';

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
    ReactiveFormsModule,
  ],
})
export class PipActionsFirmwareUpgradeComponent extends FormDirective<PipActionsFirmwareFormGroup> {
  protected readonly releases = releases;

  protected override readonly formGroup = pipActionsFirmwareFormGroup;
}

const releases = [
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
