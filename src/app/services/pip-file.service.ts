import JSZip from 'jszip';
import { wait } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-command.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';
import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipFileService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipDeviceService: PipDeviceService,
  ) {}

  /**
   * Create a directory on the device's SD card. If the directory already
   * exists, it will not be created.
   *
   * @param directory The directory to create on the device (ie "GAMES").
   * @returns True if the directory was created successfully or already
   * exists, false otherwise.
   */
  public async createSDCardDirectory(directory: string): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    try {
      const result = await this.pipCommandService.cmd<CreateDirResult>(`
        (() => {
          var fs = require("fs");
          try {
            fs.readdir("${directory}");
            return { 
              success: true,
              message: 'Directory "${directory}" already exists.',
            };
          } catch (error) { 
            try {
              fs.mkdir("${directory}");
              return { 
                success: true,
                message: 'Directory "${directory}" created successfully on device.',
              };
            } catch (mkdirError) {
              return { success: false, message: mkdirError.message };
            }
          }
        })()
      `);

      if (!result?.success) {
        const error = result?.message || 'Unknown error';
        logMessage(
          `Failed to create "${directory}" directory on device: ${error}`,
        );
        return false;
      } else {
        logMessage(result.message);
        return true;
      }
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
    }
  }

  public async getSDCardContents(): Promise<string[] | null> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    try {
      const resultSd = await this.pipCommandService.cmd<string[]>(`
        (() => {
          var fs = require("fs");
          try {
            var filenames = fs.readdir();
            return filenames;
          } catch (err) {
            return ['ERROR', err.message];
          }
        })()
      `);

      return resultSd;
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return null;
    }
  }

  /**
   * Launches a file on the device.
   *
   * @param path The path to the file on the device (ie "GAMES/doom.js").
   * @returns True if the file was loaded successfully, false otherwise.
   */
  public async launchFileOnDevice(path: string): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    try {
      const result = await this.pipCommandService.cmd<LoadFileResult>(`
        (() => {
          var fs = require("fs");
          try {
            eval(fs.readFile("${path}"));
            return { 
              success: true,
              message: 'File "${path}" loaded successfully on device!',
            };
          } catch (error) {
            return { success: false, message: error.message };
          }
        })()
      `);

      if (!result?.success) {
        const error = result?.message || 'Unknown error';
        logMessage(`Failed to load "${path}" file on device: ${error}`);
        return false;
      } else {
        logMessage(result.message);
        return true;
      }
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
    }
  }

  /**
   * Sends a single file to the device.
   *
   * @param path The path to save the file to on the device.
   * @param fileData The file data to send.
   * @param onProgress A callback with the progress percentage.
   * @returns The size of the file sent.
   */
  public async sendFileToDevice(
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

  /**
   * Extracts and uploads a ZIP file to the Pip-Boy device.
   *
   * @param file The zip file to upload.
   * @returns Whether the upload was successful.
   */
  public async uploadZipToDevice(file: File, restart = true): Promise<boolean> {
    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.entries(zip.files).filter(([_, file]) => !file.dir);

    let uploaded = 0;

    const fileSizes = await Promise.all(
      files.map(async ([_, file]) => (await file.async('uint8array')).length),
    );
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);

    await this.pipDeviceService.clearScreen('Uploading Zip...');

    for (const [path, file] of files) {
      const fileData = await file.async('uint8array');
      const uploadedSize = await this.sendFileToDevice(path, fileData);
      if (uploadedSize === 0) {
        logMessage(`Failed to upload ${path}. Aborting.`);
        return false;
      }
      uploaded += uploadedSize;
      const percent = Math.round((uploaded / totalSize) * 100);
      pipSignals.updateProgress.set(percent);

      logMessage(`Uploading ${file.name}: ${percent}%`, true);
    }

    // Wait for 1 second to allow the device to process the files
    await wait(1000);

    if (restart) {
      logMessage('Update complete! Restarting...');
      await this.pipDeviceService.restart();
    }

    await this.pipDeviceService.clearScreen('Upload complete...');

    // Wait for 1 second to give time for the message to display
    await wait(1000);

    return true;
  }
}
