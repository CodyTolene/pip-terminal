import JSZip from 'jszip';
import { Observable, firstValueFrom } from 'rxjs';
import { PipSubTabLabelEnum, PipTabLabelEnum } from 'src/app/enums';
import { PipApp } from 'src/app/models';
import { logLink, logMessage, wait } from 'src/app/utilities';

import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';

import { PipButtonComponent } from 'src/app/components/button/pip-button.component';

import { PipAppsService } from 'src/app/services/pip-apps.service';
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

  public async launchApp(pipApp: PipApp, dir = 'USER'): Promise<void> {
    const appFileName = pipApp.id;

    const publicAppUrl = 'https://github.com/CodyTolene/pip-apps';
    logLink(`Fetching "${dir}/${pipApp.id}.js" from`, publicAppUrl);

    const script = await firstValueFrom(
      this.pipAppsService.fetchAppScript(pipApp.url),
    );

    if (!script) {
      logMessage(`Failed to load ${appFileName} script.`);
      return;
    }

    pipSignals.disableAllControls.set(true);

    logMessage(`Ensuring "${dir}/" directory exists...`);
    const result = await this.pipFileService.createSDCardDirectory(dir);
    if (!result) {
      logMessage(`Failed to upload ${appFileName} to device.`);
      return;
    }

    const zip = new JSZip();
    zip.file(`${dir}/${appFileName}.js`, script);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${appFileName}.zip`, {
      type: 'application/zip',
    });

    logMessage(`Uploading ${pipApp.name}...`);

    const uploadSuccess = await this.pipFileService.uploadZipToDevice(
      zipFile,
      false,
    );
    if (!uploadSuccess) {
      logMessage(`Failed to upload ${appFileName}.js to device.`);
      return;
    }

    const launchMessage = `Launching ${pipApp.name}...`;
    await this.pipDeviceService.clearScreen(launchMessage);
    logMessage(launchMessage);
    await wait(2000);

    await this.pipFileService.launchFileOnDevice(`${dir}/${appFileName}.js`);

    pipSignals.disableAllControls.set(false);
  }
}
