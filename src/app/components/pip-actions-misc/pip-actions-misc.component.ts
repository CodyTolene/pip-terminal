import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { logMessage } from 'src/app/utilities';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/pip-button/pip-button.component';
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
          'Are you sure you want to delete all the custom apps and games on' +
          ' the device? Device will reboot on completion.',
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

        // Delete all contents in the USER directory
        const appDirectory = 'USER';
        const appDirList = [
          ...(await this.pipFileService.getAllDirectoryContents(appDirectory)),
        ]
          .filter((fileMeta) => fileMeta.type === 'dir')
          // Sort by the directory with the most '/' in the path first
          .sort((a, b) => {
            const aSlashCount = a.path.split('/').length;
            const bSlashCount = b.path.split('/').length;
            return bSlashCount - aSlashCount;
          });

        for (const appDir of appDirList) {
          const deleteSuccess =
            await this.pipFileService.deleteDirectoryOnDevice(appDir.path);

          if (deleteSuccess) {
            logMessage(`Deleted contents in ${appDir.path}`);
          } else {
            logMessage(`Failed to delete contents in ${appDir.path}`);
            logMessage('Please try again later.');
            return;
          }
        }

        // Once all nested directories are deleted, delete the base directory
        const appDirectoryDeleteSuccess =
          await this.pipFileService.deleteDirectoryOnDevice(appDirectory);
        if (appDirectoryDeleteSuccess) {
          logMessage(`Deleted ${appDirectory}`);
        } else {
          logMessage(`Failed to delete ${appDirectory}`);
          logMessage('Please try again later.');
          return;
        }

        // Now delete the APPINFO directory
        const appMetaDirectory = 'APPINFO';
        const appMetaDirList = [
          ...(await this.pipFileService.getAllDirectoryContents(
            appMetaDirectory,
          )),
        ]
          .filter((fileMeta) => fileMeta.type === 'dir')
          // Sort by the directory with the most '/' in the path first
          .sort((a, b) => {
            const aSlashCount = a.path.split('/').length;
            const bSlashCount = b.path.split('/').length;
            return bSlashCount - aSlashCount;
          });

        for (const appMetaDir of appMetaDirList) {
          const deleteSuccess =
            await this.pipFileService.deleteDirectoryOnDevice(appMetaDir.path);

          if (deleteSuccess) {
            logMessage(`Deleted contents in ${appMetaDir.path}`);
          } else {
            logMessage(`Failed to delete contents in ${appMetaDir.path}`);
            logMessage('Please try again later.');
            return;
          }
        }

        // Once all nested directories are deleted, delete the base directory
        const appMetaDirectoryDeleteSuccess =
          await this.pipFileService.deleteDirectoryOnDevice(appMetaDirectory);
        if (appMetaDirectoryDeleteSuccess) {
          logMessage(`Deleted ${appMetaDirectory}`);
        } else {
          logMessage(`Failed to delete ${appMetaDirectory}`);
          logMessage('Please try again later.');
          return;
        }

        logMessage('All apps deleted successfully.');

        await this.pipDeviceService.restart();
      });
  }

  public async logAllDirectoryContents(): Promise<void> {
    logMessage('Fetching all directory contents...');
    const rootDir = '';
    await this.pipFileService.getAllDirectoryContents(rootDir, true);
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
