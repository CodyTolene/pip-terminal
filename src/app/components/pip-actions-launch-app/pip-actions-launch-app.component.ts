import { isNonEmptyString } from '@proangular/pro-form';
import JSZip from 'jszip';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';
import { logMessage, wait } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

@Component({
  selector: 'pip-actions-launch-app',
  templateUrl: './pip-actions-launch-app.component.html',
  imports: [CommonModule, MatExpansionModule, PipButtonComponent],
  styleUrl: './pip-actions-launch-app.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionslaunchAppComponent {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  protected readonly AppsEnum = AppsEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;

  protected readonly signals = pipSignals;

  public async launchApp(app: AppsEnum): Promise<void> {
    const script = await this.loadAppScript(app);

    if (!script) {
      logMessage(`Failed to load ${app} script.`);
      return;
    }

    pipSignals.disableAllControls.set(true);

    const dir = 'USER';

    logMessage(`Ensuring "${dir}/" directory exists...`);
    const result = await this.pipFileService.createSDCardDirectory(dir);
    if (!result) {
      logMessage(`Failed to upload ${app} to device.`);
      return;
    }

    const zip = new JSZip();
    zip.file(`${dir}/${app}.js`, script);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${app}.zip`, {
      type: 'application/zip',
    });

    logMessage(`Uploading ${app}...`);

    const uploadSuccess = await this.pipFileService.uploadZipToDevice(
      zipFile,
      false,
    );
    if (!uploadSuccess) {
      logMessage(`Failed to upload ${app} to device.`);
      return;
    }

    const launchMessage = `Launching ${app}...`;
    await this.pipDeviceService.clearScreen(launchMessage);
    logMessage(launchMessage);
    await wait(2000);

    await this.pipFileService.launchFileOnDevice(`${dir}/${app}.js`);

    pipSignals.disableAllControls.set(false);
  }

  private async loadAppScript(app: AppsEnum): Promise<string | null> {
    try {
      const response = await fetch(`USER/${app}.js`);
      const appScript = await response.text();
      return isNonEmptyString(appScript) ? appScript : null;
    } catch (error) {
      console.error(`Failed to load ${app} script:`, error);
      return null;
    }
  }
}

enum AppsEnum {
  PIPSNAKE = 'PipSnake',
}
