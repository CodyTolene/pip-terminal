import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipTabsService } from 'src/app/services/pip-tabs.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-connection',
  templateUrl: './pip-actions-connection.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-connection.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsConnectionComponent {
  public constructor(
    private readonly connectionService: PipConnectionService,
    private readonly deviceService: PipDeviceService,
    private readonly pipTabsService: PipTabsService,
  ) {}

  @Input() public isGoToConnectTabButtonVisible = false;
  @Input() public isGoToMaintenanceTabButtonVisible = false;

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;

  protected async connect(): Promise<void> {
    await this.connectionService.connect();
    await this.deviceService.initialize();
  }

  protected async disconnect(): Promise<void> {
    await this.connectionService.disconnect();
  }

  protected async goToConnectTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.STAT,
      PipSubTabLabelEnum.CONNECT,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }

  protected async goToMaintenanceTab(): Promise<void> {
    await this.pipTabsService.switchToTab(
      PipTabLabelEnum.DATA,
      PipSubTabLabelEnum.MAINTENANCE,
      { playMainTabSound: true, playSubTabSound: true },
    );
  }

  protected async restart(): Promise<void> {
    await this.deviceService.restart();
  }

  protected async shutdown(): Promise<void> {
    await this.deviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.deviceService.sleep();
  }

  protected async wake(): Promise<void> {
    await this.deviceService.wake();
  }
}
