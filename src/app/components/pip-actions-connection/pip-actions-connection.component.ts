import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';

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
  ) {}

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
