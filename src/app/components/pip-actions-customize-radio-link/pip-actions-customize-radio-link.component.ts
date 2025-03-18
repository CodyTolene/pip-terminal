import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

@Component({
  selector: 'pip-actions-customize-radio-link',
  templateUrl: './pip-actions-customize-radio-link.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-customize-radio-link.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsCustomizeRadioLinkComponent {
  public constructor(private readonly pipTabsService: PipTabsService) {}

  protected async goToRadioSetTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.RADIO,
      PipSubTabLabelEnum.SET,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
