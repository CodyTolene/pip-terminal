import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import JSZip from 'jszip';
import { Observable, filter, firstValueFrom, map, shareReplay } from 'rxjs';
import { PipAppTypeEnum, SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { PipApp } from 'src/app/models';
import { isNonEmptyObject, logMessage, wait } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/dialog-confirm/pip-dialog-confirm.component';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipAppsService } from 'src/app/services/pip/pip-apps.service';
import { PipDeviceService } from 'src/app/services/pip/pip-device.service';
import { PipFileService } from 'src/app/services/pip/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-actions-apps',
  templateUrl: './pip-actions-apps.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    PipButtonComponent,
    RouterModule,
  ],
  styleUrl: './pip-actions-apps.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsAppsComponent {
  public constructor(
    private readonly dialog: MatDialog,
    private readonly pipAppsService: PipAppsService,
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {
    this.appMainDirectory = this.pipFileService.appMainDirectory;
    this.appMetaDirectory = this.pipFileService.appMetaDirectory;

    this.availablePipAppsChanges = this.pipAppsService
      .fetchRegistry()
      .pipe(filter(isNonEmptyObject), shareReplay(1));
    this.pipAppsChanges = this.availablePipAppsChanges.pipe(
      map((apps) => apps.filter((app) => app.type === PipAppTypeEnum.APP)),
    );
    this.pipGamesChanges = this.availablePipAppsChanges.pipe(
      map((apps) => apps.filter((app) => app.type === PipAppTypeEnum.GAME)),
    );
  }

  private readonly appMainDirectory: string;
  private readonly appMetaDirectory: string;

  protected readonly signals = pipSignals;

  /* The directory of the app meta within the zip file and on the device. */
  protected readonly appMetaDir = 'APPINFO';

  protected readonly PipAppTypeEnum = PipAppTypeEnum;
  protected readonly SubTabLabelEnum = SubTabLabelEnum;
  protected readonly TabLabelEnum = TabLabelEnum;

  protected readonly availablePipAppsChanges: Observable<readonly PipApp[]>;
  protected readonly pipAppsChanges: Observable<readonly PipApp[]>;
  protected readonly pipGamesChanges: Observable<readonly PipApp[]>;

  protected async delete(app: PipApp): Promise<void> {
    const dialogRef = this.dialog.open<
      PipDialogConfirmComponent,
      PipDialogConfirmInput,
      boolean | null
    >(PipDialogConfirmComponent, {
      data: {
        message: `Are you sure you want to delete "${app.name}" from the device?`,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(untilDestroyed(this))
      .subscribe(async (shouldDelete) => {
        if (!shouldDelete) return;

        pipSignals.disableAllControls.set(true);

        const appDepFolderList: string[] = [];
        let cmdResult: CmdDefaultResult = {
          success: false,
          message: 'Unknown Error',
        };

        try {
          // Delete app dependency files
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

          // Collect all dependency folders for later cleanup
          for (const file of app.files) {
            const path = file.name.substring(0, file.name.lastIndexOf('/'));
            if (!appDepFolderList.includes(path)) {
              appDepFolderList.push(path);
            }
          }

          // Delete the app's metadata file
          const appMetaPath = `${this.appMetaDirectory}/${app.id}.json`;
          cmdResult = await this.pipFileService.deleteFileOnDevice(appMetaPath);
          if (cmdResult.success) {
            logMessage(cmdResult.message);
          } else {
            logMessage(cmdResult.message);
            logMessage('Please try again later.');
            return;
          }

          // Sort folders deepest-first before deletion
          const sortedDepList = [...appDepFolderList];
          if (app.files.length > 0) {
            sortedDepList.push(`${app.id}`);
          }
          sortedDepList.sort(
            (a, b) => b.split('/').length - a.split('/').length,
          );

          // Delete empty directories
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

          logMessage(`Deleted ${app.name} successfully!`);

          await wait(1000);

          await this.pipDeviceService.clearScreen(
            'Completed! Continue deleting',
            'or restart to apply changes.',
            { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
          );

          // Refresh current installed app list
          const deviceAppInfo = await this.pipFileService.getDeviceAppInfo();
          pipSignals.currentDeviceAppList.set(deviceAppInfo ?? []);
        } finally {
          pipSignals.disableAllControls.set(false);
        }
      });
  }

  protected isAppInstalled(app: PipApp): boolean {
    const currentAppInfo = this.signals.currentDeviceAppList();
    return currentAppInfo?.some(({ id }) => id === app.id) ?? false;
  }

  protected isAppUpdatable(app: PipApp): boolean {
    const currentDeviceAppToCheck = this.signals
      .currentDeviceAppList()
      ?.find(({ id }) => id === app.id);
    if (!currentDeviceAppToCheck) return false;

    const currentVersion = currentDeviceAppToCheck.version;
    const newVersion = app.version;

    if (!currentVersion) return true; // No version on device, definitely update
    if (!newVersion || newVersion === currentVersion) return false;

    return isVersionNewer(newVersion, currentVersion);
  }

  protected async install(app: PipApp): Promise<void> {
    pipSignals.disableAllControls.set(true);

    try {
      const createAppDirSuccess = await this.createDirectoryIfNonExistent(
        this.appMainDirectory,
      );
      if (!createAppDirSuccess) {
        return;
      }

      const createAppMetaDirSucess = await this.createDirectoryIfNonExistent(
        this.appMetaDir,
      );
      if (!createAppMetaDirSucess) {
        return;
      }

      // If the app contains a dependency requiring the bootloader, install
      // the bootloader first.
      if (app.isBootloaderRequired) {
        const result = await this.pipFileService.installBootloader();
        if (result?.success) {
          logMessage(result.message);
        } else {
          logMessage(result?.message ?? 'Unknown Error');
          return;
        }
      }

      const zipFile = await this.createAppZipFile(app);
      if (!zipFile) {
        return;
      }

      const uploadSuccess = await this.uploadZipFile(app, zipFile);
      if (!uploadSuccess) {
        return;
      }

      await wait(2000);

      await this.pipDeviceService.clearScreen(
        'Completed! Continue uploading',
        'or restart to apply changes.',
        { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
      );

      // Refresh the app list after deleting an app.
      const deviceAppInfo = await this.pipFileService.getDeviceAppInfo();
      pipSignals.currentDeviceAppList.set(deviceAppInfo ?? []);
    } finally {
      pipSignals.disableAllControls.set(false);
      logMessage(`Installed ${app.name} successfully!`);
    }
  }

  protected async launch(app: PipApp): Promise<void> {
    pipSignals.disableAllControls.set(true);

    try {
      const launchMessage = `Launching ${app.name}.`;

      await this.pipDeviceService.clearScreen(launchMessage);
      logMessage(launchMessage);
      await wait(2000);

      const launchAppSuccess = await this.pipFileService.launchFileOnDevice(
        `${this.appMainDirectory}/${app.id}.js`,
      );
      if (!launchAppSuccess) {
        logMessage(`Failed to launch ${app.name}.`);
        return;
      }

      logMessage(`Launched ${app.name} successfully!`);
    } finally {
      pipSignals.disableAllControls.set(false);
    }
  }

  /**
   * Create a directory on the device's SD card.
   *
   * @param dir The directory to create on the device (ie "USER").
   * @returns True if the directory was created successfully or already
   * exists, false otherwise.
   */
  private async createDirectoryIfNonExistent(dir: string): Promise<boolean> {
    logMessage(`Ensuring "${dir}" directory exists.`);

    const result = await this.pipFileService.createDirectoryIfNonExistent(dir);

    if (!result) {
      logMessage(`Failed to create directory "${dir}" on device.`);
      return false;
    }

    return true;
  }

  /**
   * Create a zip file containing the app.
   *
   * @param app The app meta used to craft the zip file.
   * @param script The script to zip in the file.
   * @returns The zip file containing the app.
   */
  private async createAppZipFile(app: PipApp): Promise<File | null> {
    const zip = new JSZip();

    if (app.files.length > 0) {
      logMessage('Fetching app dependencies...');
      await wait(1000);

      // Loop through any extra files to add to the zip
      for (const file of app.files) {
        const baseUrl = `${environment.appsUrl}`;
        const dependencyUrl = `${baseUrl}/${file.name}`;

        const asset = await firstValueFrom(
          this.pipAppsService.fetchAsset(dependencyUrl),
        );
        if (!asset) {
          logMessage(`Failed to load asset from ${dependencyUrl}.`);
          return null;
        }

        await wait(250);

        if (!asset) {
          logMessage(`Failed to load asset from ${dependencyUrl}.`);
          return null;
        }

        logMessage(`Packing ${file.name}...`);

        zip.file(file.name, asset);
      }

      // For each asset directy, make sure it exists before upload
      for (const [fileName, zipFile] of Object.entries(zip.files)) {
        if (zipFile.dir) {
          const createDirSuccess =
            await this.createDirectoryIfNonExistent(fileName);

          if (!createDirSuccess) {
            logMessage(`Failed to create directory "${fileName}" on device.`);
            return null;
          }
        }
      }
    }

    const pipAppBase = new PipAppBase({
      ...app,
      name: `[${app.type}] ${app.name}`,
    });
    zip.file(
      `${this.appMetaDir}/${app.id}.json`,
      JSON.stringify(pipAppBase.serialize()),
    );

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${app.id}.zip`, {
      type: 'application/zip',
    });

    return zipFile;
  }

  /**
   * Upload a zip file to the device.
   *
   * @param app The app to upload to the device.
   * @param zipFile The zip file containing the app to upload.
   * @returns True if the zip file was uploaded successfully, false otherwise.
   */
  public async uploadZipFile(app: PipApp, zipFile: File): Promise<boolean> {
    await this.pipDeviceService.clearScreen('Uploading Zip...');
    const uploadSuccess = await this.pipFileService.uploadZipToDevice(zipFile);

    if (!uploadSuccess) {
      logMessage(`Failed to upload ${app.id}.js to device.`);
      return false;
    }

    await this.pipDeviceService.clearScreen('Upload complete.');
    return true;
  }
}

function isVersionNewer(a: string, b: string): boolean {
  const aParts = a.split('.').map(Number);
  const bParts = b.split('.').map(Number);

  for (let i = 0; i < Math.max(aParts.length, bParts.length); i++) {
    const aVal = aParts[i] ?? 0;
    const bVal = bParts[i] ?? 0;
    if (aVal > bVal) return true;
    if (aVal < bVal) return false;
  }

  return false; // Versions are equal
}
