import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { logMessage } from 'src/app/utilities';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/pip-dialog-confirm/pip-dialog-confirm.component';

import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipFileService } from 'src/app/services/pip-file.service';
import { PipGetDataService } from 'src/app/services/pip-get-data.service';
import { PipSoundService } from 'src/app/services/pip-sound.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-actions-misc',
  templateUrl: './pip-actions-misc.component.html',
  imports: [CommonModule, MatDialogModule, PipButtonComponent],
  styleUrl: './pip-actions-misc.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsMiscComponent {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
    private readonly pipGetDataService: PipGetDataService,
    private readonly pipSoundService: PipSoundService,
  ) {}

  @Input() public set hideDeleteAllAppsButton(value: BooleanInput) {
    this.#hideDeleteAllAppsButton = coerceBooleanProperty(value);
  }
  public get hideDeleteAllAppsButton(): boolean {
    return this.#hideDeleteAllAppsButton;
  }
  #hideDeleteAllAppsButton = false;

  protected readonly signals = pipSignals;

  private readonly dialog = inject(MatDialog);

  protected async checkBattery(): Promise<void> {
    const batteryLevel = await this.pipGetDataService.getBatteryLevel();
    pipSignals.batteryLevel.set(batteryLevel);
    logMessage(`Battery level: ${batteryLevel}%`);
  }

  protected async deleteAllApps(): Promise<void> {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message:
          'Are you sure you want to delete all the custom apps and games on the device?',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (result) => {
        // eslint-disable-next-line no-console
        console.log(`Dialog result: ${result}`);

        if (!result) {
          return;
        }

        const appDirectory = 'USER';
        const appMetaDirectory = 'APPINFO';
        const deleteAllAppsSuccess =
          (await this.pipFileService.deleteDirectoryOnDevice(appDirectory)) &&
          (await this.pipFileService.deleteDirectoryOnDevice(appMetaDirectory));

        if (deleteAllAppsSuccess) {
          logMessage('All apps deleted successfully.');
        } else {
          logMessage('Failed to delete all apps.');
        }

        await this.pipDeviceService.restart();
      });
  }

  protected async getRootDirectoryFileList(): Promise<void> {
    const dir = '';
    const sdCardContents = await this.pipFileService.getDirectoryFileList(dir);

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
