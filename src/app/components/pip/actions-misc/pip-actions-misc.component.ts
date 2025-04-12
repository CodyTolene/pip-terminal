import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { firstValueFrom } from 'rxjs';
import { logMessage } from 'src/app/utilities';

import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';
import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

import { PipAppsService } from 'src/app/services/pip/pip-apps.service';
import { PipDeviceService } from 'src/app/services/pip/pip-device.service';
import { PipFileService } from 'src/app/services/pip/pip-file.service';
import { PipGetDataService } from 'src/app/services/pip/pip-get-data.service';
import { PipSoundService } from 'src/app/services/pip/pip-sound.service';

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
    private readonly pipAppsService: PipAppsService,
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

        const installedBaseAppList = this.signals.currentDeviceAppList();

        const currentDeviceAppList = await firstValueFrom(
          this.pipAppsService.fetchRegistry(),
        );

        const apps =
          currentDeviceAppList?.filter((app) =>
            installedBaseAppList.some(
              (installedApp) => installedApp.id === app.id,
            ),
          ) ?? [];

        if (apps.length === 0) {
          logMessage('No apps to delete.');
          return;
        }

        const appMetaDirectory = 'APPINFO';

        let cmdResult: CmdDefaultResult = {
          success: false,
          message: '',
        };
        const appDepFolderList: string[] = [];

        for (const app of apps) {
          // First delete all app dependencies
          for (const file of app.files) {
            cmdResult = await this.pipFileService.deleteFileOnDevice(file.name);
            if (cmdResult.success) {
              logMessage(cmdResult.message);
            } else {
              logMessage(cmdResult.message);
              logMessage('Please try again later.');
              return;
            }
          }

          // Clean up the app dependency empty folders
          for (const file of app.files) {
            // Get the directory minus the file name
            const path = file.name.substring(0, file.name.lastIndexOf('/'));
            // Add the path to the list if it doesn't already exist
            if (!appDepFolderList.includes(path)) {
              appDepFolderList.push(path);
            }
          }

          // Delete the apps meta json
          const appMetaPath = `${appMetaDirectory}/${app.id}.json`;
          cmdResult = await this.pipFileService.deleteFileOnDevice(appMetaPath);
          if (cmdResult.success) {
            logMessage(cmdResult.message);
          } else {
            logMessage(cmdResult.message);
            logMessage('Please try again later.');
            return;
          }
        }

        const sortedDepList = [...appDepFolderList]
          // Sort by the directory with the most '/' in the path first
          .sort((a, b) => {
            const aSlashCount = a.split('/').length;
            const bSlashCount = b.split('/').length;
            return bSlashCount - aSlashCount;
          });

        // Delete the app dependency folders
        for (const path of sortedDepList) {
          cmdResult = await this.pipFileService.deleteDirectoryOnDevice(path);
          if (cmdResult.success) {
            if (!cmdResult.message.toLowerCase().includes('skipping')) {
              logMessage(cmdResult.message);
            }
          } else {
            logMessage(cmdResult.message);
            logMessage('Please try again later.');
            return;
          }
        }

        logMessage('All apps deleted successfully.');

        await this.pipDeviceService.restart();
      });
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
