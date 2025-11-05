import {
  PipFileService,
  PipGetDataService,
  PipSoundService,
} from 'src/app/services';
import { pipSignals } from 'src/app/signals';
import { logMessage } from 'src/app/utilities';

import { Component, Input, booleanAttribute, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import { PipTitleComponent } from 'src/app/components/title/title.component';

@Component({
  selector: 'pip-actions-misc',
  templateUrl: './pip-actions-misc.component.html',
  imports: [MatDialogModule, PipButtonComponent, PipTitleComponent],
  styleUrl: './pip-actions-misc.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsMiscComponent {
  private readonly pipFileService = inject(PipFileService);
  private readonly pipGetDataService = inject(PipGetDataService);
  private readonly pipSoundService = inject(PipSoundService);

  @Input({ transform: booleanAttribute })
  public hideDeleteAllAppsButton = false;

  protected readonly signals = pipSignals;

  private readonly dialog = inject(MatDialog);

  protected async checkBattery(): Promise<void> {
    const batteryLevel = await this.pipGetDataService.getBatteryLevel();
    pipSignals.batteryLevel.set(batteryLevel);
    logMessage(`Battery level: ${batteryLevel}%`);
  }

  public async logAllDirectoryContents(): Promise<void> {
    logMessage('Fetching all directory contents...');
    const rootDir = '';
    await this.pipFileService.getTree(rootDir, true);
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
    await this.pipSoundService.stopAllSounds();
  }
}
