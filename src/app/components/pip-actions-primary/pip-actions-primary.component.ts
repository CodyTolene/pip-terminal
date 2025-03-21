import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-primary',
  templateUrl: './pip-actions-primary.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-primary.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsPrimaryComponent {
  public constructor(
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
  ) {}

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;

  protected async connect(): Promise<void> {
    await this.pipConnectionService.connect();
    await this.pipDeviceService.initialize();
  }

  protected async disconnect(): Promise<void> {
    await this.pipConnectionService.disconnect();
  }

  protected async restart(): Promise<void> {
    await this.pipDeviceService.restart();
  }

  protected async shutdown(): Promise<void> {
    await this.pipDeviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.pipDeviceService.sleep();
  }

  protected async wake(): Promise<void> {
    await this.pipDeviceService.wake();
  }
}
