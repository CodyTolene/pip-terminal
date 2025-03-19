import JSZip from 'jszip';
import { wait } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';
import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipFileService {
  public constructor(
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
  ) {}

  public async startUpdate(file: File): Promise<void> {
    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.entries(zip.files).filter(([_, file]) => !file.dir);

    let uploaded = 0;

    const fileSizes = await Promise.all(
      files.map(async ([_, file]) => (await file.async('uint8array')).length),
    );
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);

    this.pipDeviceService.clearScreen('Updating...');

    for (const [path, file] of files) {
      const fileData = await file.async('uint8array');
      const uploadedSize = await this.uploadFileToPip(path, fileData);
      if (uploadedSize === 0) {
        logMessage(`Failed to upload ${path}. Aborting.`);
        return;
      }
      uploaded += uploadedSize;
      const percent = Math.round((uploaded / totalSize) * 100);
      pipSignals.updateProgress.set(percent);

      logMessage(`Uploading ${file.name}: ${percent}%`, true);
    }

    // Wait for 1 second to allow the device to process the files
    await wait(1000);

    logMessage('Update complete! Restarting...');
    await this.pipDeviceService.restart();
  }

  private async uploadFileToPip(
    path: string,
    fileData: Uint8Array,
    onProgress?: (progress: number) => void,
  ): Promise<number> {
    const fileString = new TextDecoder('latin1').decode(fileData);

    try {
      await this.pipConnectionService.connection?.espruinoSendFile(
        path,
        fileString,
        {
          fs: true,
          chunkSize: 1024,
          noACK: true,
          progress: (chunkNo: number, chunkCount: number) => {
            const percent = Math.round((chunkNo / chunkCount) * 100);

            if (onProgress) {
              onProgress(percent);
            }
          },
        },
      );

      return fileData.length;
    } catch (error) {
      logMessage(`Upload failed for ${path}: ${(error as Error)?.message}`);
      return 0;
    }
  }

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

    this.pipDeviceService.clearScreen(`Uploading ${filePath}`);

    await this.uploadFileToPip(filePath, uint8Array, onProgress);

    // Wait for 1 second to allow the device to process the file
    await wait(1000);

    this.pipDeviceService.clearScreen(
      'Completed! Continue uploading',
      'or restart to apply changes.',
      { filename: 'UI/THUMBDOWN.avi', x: 160, y: 40 },
    );
  }
}
