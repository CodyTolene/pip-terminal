import JSZip from 'jszip';

import { Injectable } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';
import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipFileService {
  public constructor(
    private readonly connectionService: PipConnectionService,
    private readonly deviceService: PipDeviceService,
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
    }
    logMessage('Firmware update complete! Rebooting...');
    await this.deviceService.restart();
  }

  private async uploadFileToPip(
    path: string,
    fileData: Uint8Array,
  ): Promise<number> {
    const fileString = new TextDecoder('latin1').decode(fileData);
    try {
      await this.connectionService.connection?.espruinoSendFile(
        path,
        fileString,
        {
          fs: true,
          chunkSize: 1024,
          noACK: true,
        },
      );
      return fileData.length;
    } catch (error) {
      logMessage(`Upload failed for ${path}: ${(error as Error)?.message}`);
      return 0;
    }
  }
}
