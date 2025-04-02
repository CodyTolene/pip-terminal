import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import JSZip from 'jszip';
import { Observable, filter, firstValueFrom, map, shareReplay } from 'rxjs';
import {
  PipAppTypeEnum,
  PipSubTabLabelEnum,
  PipTabLabelEnum,
} from 'src/app/enums';
import { PipApp } from 'src/app/models';
import { isNonEmptyObject, logMessage, wait } from 'src/app/utilities';
import { environment } from 'src/environments/environment';

import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/pip-button/pip-button.component';
import {
  PipDialogConfirmComponent,
  PipDialogConfirmInput,
} from 'src/app/components/pip-dialog-confirm/pip-dialog-confirm.component';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipAppsService } from 'src/app/services/pip-apps.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@UntilDestroy()
@Component({
  selector: 'pip-actions-launch-app',
  templateUrl: './pip-actions-launch-app.component.html',
  imports: [
    CommonModule,
    MatDialogModule,
    MatExpansionModule,
    PipButtonComponent,
    RouterModule,
  ],
  styleUrl: './pip-actions-launch-app.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionslaunchAppComponent {
  public constructor(
    private readonly pipAppsService: PipAppsService,
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {
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

  private readonly dialog = inject(MatDialog);

  protected readonly signals = pipSignals;

  /* The directory of the app meta within the zip file and on the device. */
  protected readonly appMetaDir = 'APPINFO';

  protected readonly PipAppTypeEnum = PipAppTypeEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;

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
      .subscribe(async (result) => {
        if (!result) return;

        pipSignals.disableAllControls.set(true);

        try {
          // Delete the main files
          await this.pipFileService.deleteFileOnDevice(
            `${app.id}.js`,
            environment.appsDir,
          );
          await this.pipFileService.deleteFileOnDevice(
            `${app.id}.json`,
            this.appMetaDir,
          );

          // Delete all contents in the USER directory
          if (app.dependencies.length > 0) {
            logMessage('App has dependencies, deleting...');
            await wait(1000);

            const appDirectory = `USER/${app.id}`;
            const appDirList = [
              ...(await this.pipFileService.getTree(appDirectory)),
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
                logMessage(`Deleted all dependencies in ${appDir.path}`);
              } else {
                logMessage(
                  `Failed to delete all dependencies in ${appDir.path}`,
                );
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
          }

          logMessage(`Deleted ${app.name} successfully!`);

          wait(2000);

          await this.pipDeviceService.clearScreen(
            'Completed! Continue deleting',
            'or restart to apply changes.',
            { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
          );

          // Refresh the app list after deleting an app.
          const deviceAppInfo = await this.pipFileService.getDeviceAppInfo();
          pipSignals.appInfo.set(deviceAppInfo ?? []);
        } finally {
          pipSignals.disableAllControls.set(false);
        }
      });
  }

  protected goToAppsGithub(): void {
    window.open('https://github.com/CodyTolene/pip-apps', '_blank');
  }

  protected isAppInstalled(app: PipApp): boolean {
    const currentAppInfo = this.signals.appInfo();
    return currentAppInfo?.some(({ id }) => id === app.id) ?? false;
  }

  protected isAppUpdatable(app: PipApp): boolean {
    const currentDeviceAppToCheck = this.signals
      .appInfo()
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
        environment.appsDir,
      );
      if (!createAppDirSuccess) return;

      const createAppMetaDirSucess = await this.createDirectoryIfNonExistent(
        this.appMetaDir,
      );
      if (!createAppMetaDirSucess) return;

      const zipFile = await this.createAppZipFile(app);
      if (!zipFile) return;

      const uploadSuccess = await this.uploadZipFile(app, zipFile);
      if (!uploadSuccess) return;

      await wait(2000);

      await this.pipDeviceService.clearScreen(
        'Completed! Continue uploading',
        'or restart to apply changes.',
        { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
      );

      // Refresh the app list after deleting an app.
      const deviceAppInfo = await this.pipFileService.getDeviceAppInfo();
      pipSignals.appInfo.set(deviceAppInfo ?? []);
    } finally {
      pipSignals.disableAllControls.set(false);
      logMessage(`Installed ${app.name} successfully!`);
    }
  }

  protected async launch(app: PipApp): Promise<void> {
    pipSignals.disableAllControls.set(true);

    try {
      const launchAppSuccess = await this.launchAppOnDevice(
        app,
        environment.appsDir,
      );
      if (!launchAppSuccess) return;

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
    const script = await this.fetchAppScript(app);
    if (!script) {
      logMessage(`Failed to load ${app.id} script.`);
      return null;
    }

    const zip = new JSZip();

    // Zip the main file
    zip.file(`${environment.appsDir}/${app.id}.js`, script);

    if (app.dependencies.length > 0) {
      logMessage('App has dependencies, fetching...');
      await wait(1000);

      // Loop through any extra files to add to the zip
      for (const dependency of app.dependencies) {
        const baseUrl = `${environment.appsUrl}/${environment.appsDir}`;
        const dependencyUrl = `${baseUrl}/${dependency}`;

        const asset = await this.fetchAppAsset(dependencyUrl);

        await wait(250);

        if (!asset) {
          logMessage(`Failed to load asset from ${dependencyUrl}.`);
          return null;
        }

        logMessage(`Packing ${dependency}...`);

        zip.file(`${environment.appsDir}/${dependency}`, asset);
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
   * Fetch the script for an app.
   *
   * @param app The app to fetch the script for.
   * @param dir The directory to fetch the script from.
   * @returns The script for the app, or null if the script could not be fetched.
   */
  private async fetchAppScript(app: PipApp): Promise<string | null> {
    logMessage(`Fetching "${app.id}.js"`);

    const script = await firstValueFrom(
      this.pipAppsService.fetchAsset(app.url),
    );

    if (!script) {
      logMessage(`Failed to load ${app.id} script.`);
      return null;
    }

    return script;
  }

  private async fetchAppAsset(url: string): Promise<string | null> {
    const asset = await firstValueFrom(this.pipAppsService.fetchAsset(url));

    if (!asset) {
      logMessage(`Failed to load asset from ${url}.`);
      return null;
    }

    return asset;
  }

  /**
   * Launch an app on the device.
   *
   * @param app The app to launch on the device.
   * @param dir The directory of the app on the device.
   * @returns True if the app was launched successfully, false otherwise.
   */
  private async launchAppOnDevice(app: PipApp, dir: string): Promise<boolean> {
    const launchMessage = `Launching ${app.name}.`;
    await this.pipDeviceService.clearScreen(launchMessage);
    logMessage(launchMessage);
    await wait(2000);
    return await this.pipFileService.launchFileOnDevice(`${dir}/${app.id}.js`);
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
