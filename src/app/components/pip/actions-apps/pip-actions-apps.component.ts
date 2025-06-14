import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import JSZip from 'jszip';
import { Observable, filter, firstValueFrom, map, shareReplay } from 'rxjs';
import { PipAppTypeEnum, SubTabLabelEnum, TabLabelEnum } from 'src/app/enums';
import { PipApp } from 'src/app/models';
import { pipSignals } from 'src/app/signals';
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

import { PipAppsService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-apps.service';
import { PipDeviceService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-device.service';
import { PipFileService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-file.service';

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
          const blob = await firstValueFrom(
            this.pipAppsService.fetchZipFile(app.zip),
          );
          if (!blob) {
            logMessage(`Failed to download zip for ${app.name}.`);
            return;
          }

          const zip = await JSZip.loadAsync(blob);
          const filePaths = this.getZipFilePaths(zip);

          if (filePaths.length === 0) {
            logMessage(`No files found in ${app.name} zip.`);
            return;
          }

          // Delete app dependency files
          for (const filePath of filePaths) {
            const ok = await this.deleteJsVariants(filePath, true);
            if (!ok) return;
          }

          // Clean up any items in nested app/game directories before install
          const dirOk = await this.deleteAppRootDirectories(filePaths);
          if (!dirOk) return;

          // Collect all dependency folders for later cleanup
          for (const filePath of filePaths) {
            const path = filePath.substring(0, filePath.lastIndexOf('/'));
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
          if (filePaths.length > 0) {
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

  protected getAppZipUrl(app: PipApp): string {
    return `${environment.appsUrl}/${app.zip}`;
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
        false,
      );
      if (!createAppDirSuccess) {
        return;
      }

      const createAppMetaDirSucess = await this.createDirectoryIfNonExistent(
        this.appMetaDir,
        false,
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

      const blob = await firstValueFrom(
        this.pipAppsService.fetchZipFile(app.zip),
      );
      if (!blob) {
        logMessage(`Failed to download zip for ${app.name}.`);
        return;
      }

      const zip = await JSZip.loadAsync(blob);
      const filePaths = this.getZipFilePaths(zip);

      // Clean up any previous .js/.min.js variants before install
      for (const filePath of filePaths) {
        const ok = await this.deleteJsVariants(filePath);
        if (!ok) return;
      }

      // Clean up any items in nested app/game directories before install
      const dirOk = await this.deleteAppRootDirectories(filePaths);
      if (!dirOk) return;

      const uploadSuccess = await this.uploadZipBlobFile(app, blob);
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
    } catch {
      logMessage(`Failed to install ${app.name}.`);
      return;
    } finally {
      pipSignals.disableAllControls.set(false);
    }

    logMessage(`Installed ${app.name} successfully!`);
  }

  /**
   * Create a directory on the device's SD card.
   *
   * @param dir The directory to create on the device (ie "USER").
   * @returns True if the directory was created successfully or already
   * exists, false otherwise.
   */
  private async createDirectoryIfNonExistent(
    dir: string,
    log: boolean,
  ): Promise<boolean> {
    // logMessage(`Ensuring "${dir}" directory exists.`);

    const result = await this.pipFileService.createDirectoryIfNonExistent(
      dir,
      log,
    );

    if (!result) {
      logMessage(`Failed to create directory "${dir}" on device.`);
      return false;
    }

    return true;
  }

  private async deleteAppRootDirectories(
    filePaths: readonly string[],
  ): Promise<boolean> {
    const roots = new Set<string>();

    // Determine root-level folders to scan (e.g., USER/StatsDisplay)
    for (const filePath of filePaths) {
      if (filePath.endsWith('.js') || filePath.endsWith('.min.js')) {
        continue; // Skip known top-level file entries
      }

      const parts = filePath.split('/');
      if (parts.length >= 2) {
        roots.add(parts.slice(0, 2).join('/'));
      }
    }

    // For each root, walk tree and collect directories
    for (const root of roots) {
      const tree = await this.pipFileService.getTree(root);
      const allDirs: string[] = [];

      const collectDirs = (branches: readonly Branch[]): void => {
        for (const branch of branches) {
          if (branch.type === 'dir') {
            allDirs.push(branch.path);
            if (branch.children) {
              collectDirs(branch.children);
            }
          }
        }
      };

      collectDirs(tree);

      // Sort directories deepest-first
      allDirs.sort((a, b) => b.split('/').length - a.split('/').length);

      // Delete each subdirectory
      for (const dir of allDirs) {
        const result = await this.pipFileService.deleteDirectoryOnDevice(dir);
        if (result.success) {
          logMessage(`Deleted directory: ${dir}`);
        } else if (!result.message.toLowerCase().includes('not found')) {
          logMessage(`Failed to delete directory ${dir}: ${result.message}`);
          return false;
        }
      }

      // Delete the root directory itself
      const rootResult =
        await this.pipFileService.deleteDirectoryOnDevice(root);
      if (rootResult.success) {
        // logMessage(`Deleted root directory: ${root}`);
      } else if (!rootResult.message.toLowerCase().includes('not found')) {
        logMessage(`Failed to delete root ${root}: ${rootResult.message}`);
        return false;
      }
    }

    return true;
  }

  private async deleteJsVariants(
    fileName: string,
    report = false,
  ): Promise<boolean> {
    const pathsToTry = new Set<string>([fileName]);

    if (fileName.endsWith('.min.js')) {
      pathsToTry.add(fileName.replace(/\.min\.js$/, '.js'));
    } else if (fileName.endsWith('.js')) {
      pathsToTry.add(fileName.replace(/\.js$/, '.min.js'));
    }

    for (const path of pathsToTry) {
      const result = await this.pipFileService.deleteFileOnDevice(path);

      const msg = result.message.toLowerCase();
      const wasSkipped =
        msg.includes('already deleted') || msg.includes('not found');

      if (result.success && !wasSkipped) {
        if (report) logMessage(`Deleted: ${path}`);
      } else if (!result.success && !wasSkipped) {
        logMessage(`Failed to delete ${path}: ${result.message}`);
        return false;
      }
    }

    return true;
  }

  /**
   * Return all file paths in the zip file, sorted by most nested (deepest)
   * first.
   *
   * @param zip The JSZip object containing the files.
   * @returns An array of file paths in the zip file.
   */
  private getZipFilePaths(zip: JSZip): readonly string[] {
    const filePaths: string[] = Object.entries(zip.files)
      .filter(([_, file]) => !file.dir)
      .map(([name]) => name)
      .sort((a, b) => b.split('/').length - a.split('/').length);
    return filePaths;
  }

  /**
   * Upload a zip file to the device.
   *
   * @param app The app to upload to the device.
   * @param zipFile The zip file containing the app to upload.
   * @returns True if the zip file was uploaded successfully, false otherwise.
   */
  private async uploadZipBlobFile(
    app: PipApp,
    zipBlob: Blob,
  ): Promise<boolean> {
    await this.pipDeviceService.clearScreen('Uploading Zip...');

    const zipFile = new File([zipBlob], `${app.id}.zip`, {
      type: 'application/zip',
    });

    const uploadSuccess = await this.pipFileService.uploadZipToDevice(zipFile);

    if (!uploadSuccess) {
      logMessage(`Failed to upload ${app.id}.zip to device.`);
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
