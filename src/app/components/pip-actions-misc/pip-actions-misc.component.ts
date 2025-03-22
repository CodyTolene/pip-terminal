import { logMessage } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipFileService } from 'src/app/services/pip-file.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSoundService } from 'src/app/services/pip-sound.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-misc',
  templateUrl: './pip-actions-misc.component.html',
  imports: [CommonModule, PipButtonComponent],
  styleUrl: './pip-actions-misc.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsMiscComponent {
  public constructor(
    private readonly pipFileService: PipFileService,
    private readonly pipGetDataService: PipGetDataService,
    private readonly pipSoundService: PipSoundService,
  ) {}

  protected readonly signals = pipSignals;

  protected async checkBattery(): Promise<void> {
    const batteryLevel = await this.pipGetDataService.getBatteryLevel();
    pipSignals.batteryLevel.set(batteryLevel);
    logMessage(`Battery level: ${batteryLevel}%`);
  }

  protected async getDirectoryFileList(): Promise<void> {
    const sdCardContents = await this.pipFileService.getDirectoryFileList();

    logMessage(
      'SD Card Contents:' +
        (sdCardContents?.join(', ') ?? 'Error: No response from device.'),
    );
  }

  protected async getSDCardMBSpace(): Promise<void> {
    const sdCardStats = await this.pipGetDataService.getSDCardStats();
    pipSignals.sdCardMbSpace.set(sdCardStats);
    logMessage(
      `SD card space: ${sdCardStats.freeMb} / ${sdCardStats.totalMb} MB`,
    );
  }

  protected async stopAllSounds(): Promise<void> {
    logMessage('Stopping all sounds on device...');
    await this.pipSoundService.stopAllSoundsOnDevice();
  }
}
