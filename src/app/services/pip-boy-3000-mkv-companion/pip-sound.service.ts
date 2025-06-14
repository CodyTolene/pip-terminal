import { Commands } from 'src/app/commands';
import { DxRadioFileNameEnum, MxRadioFileNameEnum } from 'src/app/enums';
import { logMessage, wait } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-boy-3000-mkv-companion/pip-command.service';
import { PipConnectionService } from 'src/app/services/pip-boy-3000-mkv-companion/pip-connection.service';
import { PipDeviceService } from 'src/app/services/pip-boy-3000-mkv-companion/pip-device.service';
import { PipFileService } from 'src/app/services/pip-boy-3000-mkv-companion/pip-file.service';

/** Service for managing sounds on the Pip device. */
@Injectable({ providedIn: 'root' })
export class PipSoundService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
    private readonly pipFileService: PipFileService,
  ) {}

  /**
   * Plays a radio file on the device.
   *
   * @param radioFileName The name of the radio file to play.
   * @returns A promise that resolves to true if the radio file was played
   * successfully, false otherwise.
   */
  public async playRadioFile(
    radioFileName: DxRadioFileNameEnum | MxRadioFileNameEnum,
  ): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first before clearing screen.');
      return false;
    }

    try {
      await this.stopAllSounds();

      const command = Commands.playRadioFile(radioFileName);
      const result = await this.pipCommandService.run<boolean>(command);

      return result ?? false;
    } catch {
      logMessage(`Failed to play radio file "${radioFileName}".`);
      return false;
    }
  }

  /**
   * Stops all sounds on the device.
   *
   * @returns A promise that resolves to true if all sounds were stopped
   * successfully, false otherwise.
   */
  public async stopAllSounds(): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first before clearing screen.');
      return false;
    }

    try {
      const command = Commands.stopAllSounds();
      const result = await this.pipCommandService.run<boolean>(command);

      return result ?? false;
    } catch {
      logMessage('Failed to stop all sounds.');
      return false;
    }
  }

  /**
   * Uploads a .wav file to the device.
   *
   * @param file The .wav file to upload.
   * @param onProgress Optional callback for upload progress.
   */
  public async uploadRadioWavFile(
    file: File,
    onProgress?: (progress: number) => void,
  ): Promise<void> {
    if (!file.type.includes('audio/wav')) {
      logMessage('Invalid file type. Please select a .wav file.');
      return;
    }

    const filePath = `/RADIO/${file.name}`;

    const fileData = await file.arrayBuffer();
    const uint8Array = new Uint8Array(fileData);

    await this.pipDeviceService.clearScreen(`Uploading ${filePath}`);

    await this.pipFileService.sendFileToDevice(
      filePath,
      uint8Array,
      onProgress,
    );

    // Wait for 1 second to allow the device to process the file
    await wait(1000);

    await this.pipDeviceService.clearScreen(
      'Completed! Continue uploading',
      'or restart to apply changes.',
      { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
    );
  }
}
