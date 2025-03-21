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
  selector: 'pip-actions-launch-game',
  templateUrl: './pip-actions-launch-game.component.html',
  imports: [CommonModule, MatExpansionModule, PipButtonComponent],
  styleUrl: './pip-actions-launch-game.component.scss',
  providers: [],
  standalone: true,
})
export class PipActionsLaunchGameComponent {
  public constructor(
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  protected readonly GamesEnum = GamesEnum;
  protected readonly PipTabLabelEnum = PipTabLabelEnum;
  protected readonly PipSubTabLabelEnum = PipSubTabLabelEnum;

  protected readonly signals = pipSignals;

  public async launchGame(game: GamesEnum): Promise<void> {
    const script = await this.loadGameScript(game);

    if (!script) {
      logMessage(`Failed to load ${game} script.`);
      return;
    }

    pipSignals.disableAllControls.set(true);

    const dir = 'GAMES';

    logMessage(`Ensuring "${dir}/" directory exists...`);
    const result = await this.pipFileService.createSDCardDirectory(dir);
    if (!result) {
      logMessage(`Failed to upload ${game} to device.`);
      return;
    }

    const zip = new JSZip();
    zip.file(`${dir}/${game}.js`, script);

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const zipFile = new File([zipBlob], `${game}.zip`, {
      type: 'application/zip',
    });

    logMessage(`Uploading ${game}...`);

    const uploadSuccess = await this.pipFileService.uploadZipToDevice(
      zipFile,
      false,
    );
    if (!uploadSuccess) {
      logMessage(`Failed to upload ${game} to device.`);
      return;
    }

    const launchMessage = `Launching ${game}...`;
    await this.pipDeviceService.clearScreen(launchMessage);
    logMessage(launchMessage);
    await wait(2000);

    await this.pipFileService.launchFileOnDevice(`${dir}/${game}.js`);

    pipSignals.disableAllControls.set(false);
  }

  private async loadGameScript(game: GamesEnum): Promise<string | null> {
    try {
      const response = await fetch(`games/${game}.js`);
      const gameScript = await response.text();
      return isNonEmptyString(gameScript) ? gameScript : null;
    } catch (error) {
      console.error(`Failed to load ${game} script:`, error);
      return null;
    }
  }
}

enum GamesEnum {
  PIPSNAKE = 'PipSnake',
}
