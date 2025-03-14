import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-status',
  templateUrl: './pip-status.component.html',
  imports: [CommonModule, MatIconModule, PipButtonComponent],
  styleUrl: './pip-status.component.scss',
  standalone: true,
})
export class PipStatusComponent {
  public constructor(protected readonly pipTabsService: PipTabsService) {}

  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;

  protected readonly signals = pipSignals;

  protected async switchToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
