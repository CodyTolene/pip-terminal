import { SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { TabsService } from 'src/app/services/tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-status-page',
  templateUrl: './status-page.component.html',
  imports: [CommonModule, MatIconModule, PipButtonComponent],
  styleUrl: './status-page.component.scss',
  standalone: true,
})
export class StatusPageComponent {
  public constructor(protected readonly tabsService: TabsService) {}

  protected readonly TabLabelEnum = TabLabelEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;

  protected readonly signals = pipSignals;

  protected async switchToConnectTab(): Promise<void> {
    await this.tabsService.switchToTab(
      TabLabelEnum.STAT,
      SubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }
}
