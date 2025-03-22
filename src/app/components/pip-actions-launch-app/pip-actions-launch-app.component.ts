import JSZip from 'jszip';
import { Observable, firstValueFrom } from 'rxjs';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';
import { PipApp } from 'src/app/models';
import { logLink, logMessage, wait } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { RouterModule } from '@angular/router';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipAppsService } from 'src/app/services/pip-apps.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-launch-app',
  templateUrl: './pip-actions-launch-app.component.html',
  imports: [CommonModule, MatExpansionModule, PipButtonComponent, RouterModule],
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
    this.pipAppsChanges = this.pipAppsService.fetchRegistry();
  }

  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;

  protected readonly signals = pipSignals;

  protected readonly pipAppsChanges: Observable<readonly PipApp[] | undefined>;

  public goToAppsGithub(): void {
    window.open('https://github.com/CodyTolene/pip-apps', '_blank');
  }

  public async launchApp(app: PipApp, appDir = 'USER'): Promise<void> {
    pipSignals.disableAllControls.set(true);

    try {
      const script = await this.fetchAppScript(app, appDir);
      if (!script) return;

      const appDirExists = await this.createDirectoryIfNonExistent(appDir);
      if (!appDirExists) return;

      const appMetaDir = 'APPINFO';
      const appMetaDirExists =
        await this.createDirectoryIfNonExistent(appMetaDir);
      if (!appMetaDirExists) return;

      const zipFile = await this.createAppZipFile(
        app,
        appDir,
        appMetaDir,
        script,
      );

      const uploadSuccess = await this.uploadZipFile(app, zipFile);
      if (!uploadSuccess) return;

      await wait(1000);

      const launchAppSuccess = await this.launchAppOnDevice(app, appDir);
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
    logMessage(`Ensuring "${dir}/" directory exists.`);

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
   * @param appDir The directory of the app within the zip file.
   * @param appMetaDir The directory of the app meta within the zip file.
   * @param script The script to zip in the file.
   * @returns The zip file containing the app.
   */
  private async createAppZipFile(
    app: PipApp,
    appDir: string,
    appMetaDir: string,
    script: string,
  ): Promise<File> {
    const zip = new JSZip();
    zip.file(`${appDir}/${app.id}.js`, script);

    const pipAppBase = new PipAppBase(app);
    zip.file(
      `${appMetaDir}/${app.id}.json`,
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
  private async fetchAppScript(
    app: PipApp,
    dir: string,
  ): Promise<string | null> {
    const publicAppUrl = 'https://github.com/CodyTolene/pip-apps';
    logLink(`Fetching "${dir}/${app.id}.js" from`, publicAppUrl);

    const script = await firstValueFrom(
      this.pipAppsService.fetchAppScript(app.url),
    );

    if (!script) {
      logMessage(`Failed to load ${app.id} script.`);
      return null;
    }

    return script;
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
