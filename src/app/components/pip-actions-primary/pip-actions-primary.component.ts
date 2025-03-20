import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';
import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipConnectionService } from 'src/app/services/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSoundService } from 'src/app/services/pip-sound.service';
import { PipTabsService } from 'src/app/services/pip-tabs.service';

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
    private readonly pipGetDataService: PipGetDataService,
    private readonly pipSoundService: PipSoundService,
    private readonly pipTabsService: PipTabsService,
  ) {}

  @Input() public isGoToConnectTabButtonVisible = false;
  @Input() public isGoToMaintenanceTabButtonVisible = false;

  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly signals = pipSignals;

  protected async connect(): Promise<void> {
    await this.pipConnectionService.connect();
    await this.pipDeviceService.initialize();
  }

  protected async checkBattery(): Promise<void> {
    const batteryLevel = await this.pipGetDataService.getBatteryLevel();
    pipSignals.batteryLevel.set(batteryLevel);
    logMessage(`Battery level: ${batteryLevel}%`);
  }

  protected async getSDCardMBSpace(): Promise<void> {
    const sdCardStats = await this.pipGetDataService.getSDCardStats();
    pipSignals.sdCardMbSpace.set(sdCardStats);
    logMessage(
      `SD card space: ${sdCardStats.freeMb} / ${sdCardStats.totalMb} MB`,
    );
  }

  protected async disconnect(): Promise<void> {
    await this.pipConnectionService.disconnect();
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
    await this.pipDeviceService.restart();
  }

  protected async shutdown(): Promise<void> {
    await this.pipDeviceService.shutdown();
  }

  protected async sleep(): Promise<void> {
    await this.pipDeviceService.sleep();
  }

  protected async stopAllSounds(): Promise<void> {
    logMessage('Stopping all sounds on device...');
    await this.pipSoundService.stopAllSoundsOnDevice();
  }

  protected async wake(): Promise<void> {
    await this.pipDeviceService.wake();
  }
}
