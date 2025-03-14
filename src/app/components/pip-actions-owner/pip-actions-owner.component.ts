import { FormDirective, InputComponent } from '@proangular/pro-form';

import { CommonModule } from '@angular/common';
import { Component, OnInit, effect } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipSetDataService } from 'src/app/services/pip-set-data.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Component({
  selector: 'pip-actions-owner',
  templateUrl: './pip-actions-owner.component.html',
  imports: [
    CommonModule,
    InputComponent,
    PipButtonComponent,
    ReactiveFormsModule,
  ],
  styleUrl: './pip-actions-owner.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsOwnerComponent
  extends FormDirective<OwnerFormGroup>
  implements OnInit
{
  public constructor(private readonly setDataService: PipSetDataService) {
    super();

    effect(() => {
      this.updateFormControlState();
    });
  }

  protected override readonly formGroup = formGroup;
  protected readonly signals = pipSignals;

  public ngOnInit(): void {
    this.formGroup.reset();
  }

  protected async resetOwnerName(): Promise<void> {
    await this.setDataService.resetOwnerName();
  }

  protected async setOwnerName(): Promise<void> {
    if (this.formGroup.invalid) {
      this.highlightInvalidControls();
      // this.scrollToFirstInvalidControl();
      logMessage('Owner name invalid!');
      return;
    }

    const name = this.formGroup.controls.name.value;
    await this.setDataService.setOwnerName(name);
  }

  private updateFormControlState(): void {
    const shouldDisable =
      !pipSignals.isConnected() || pipSignals.disableAllControls();

    if (shouldDisable) {
      this.formGroup.controls.name.disable({ emitEvent: false });
    } else {
      this.formGroup.controls.name.enable({ emitEvent: false });
    }
  }
}

export interface OwnerFormGroup {
  name: FormControl<string | null>;
}

export const formGroup = new FormGroup<OwnerFormGroup>({
  name: new FormControl<string | null>(null, [
    Validators.required,
    Validators.minLength(1),
    Validators.maxLength(20),
  ]),
});
