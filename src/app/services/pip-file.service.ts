import JSZip, { JSZipObject } from 'jszip';

import { Injectable } from '@angular/core';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipCommandService } from 'src/app/services/pip-command.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';

@Injectable({ providedIn: 'root' })
export class PipFileService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
  ) {}

  /**
   * Create a directory on the device's SD card. If the directory already
   * exists, it will not be created.
   *
   * @param directory The directory to create on the device (ie "USER").
   * @returns True if the directory was created successfully or already
   * exists, false otherwise.
   */
  public async createDirectoryIfNonExistent(
    directory: string,
  ): Promise<boolean> {
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
              message: 'Directory "${directory}/" already exists.',
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

  public async getDirectoryFileList(directory = ''): Promise<string[] | null> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return null;
    }

    try {
      const resultSd = await this.pipCommandService.cmd<string>(`
        (() => {
          var fs = require("fs");
          try {
            var filenames = fs.readdir(${JSON.stringify(directory)});
            return JSON.stringify(filenames);
          } catch (err) {
            return JSON.stringify({ error: err.message });
          }
        })()
      `);

      if (!resultSd) {
        logMessage('Failed to get a response from the device.');
        return null;
      }

      const parsed = JSON.parse(resultSd);
      if (parsed?.error) {
        logMessage(`Failed to read directory: ${parsed.error}`);
        return null;
      }

      return parsed;
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return null;
    }
  }

  /**
   * Launches a file on the device.
   *
   * @param path The path to the file on the device (ie "USER/doom.js").
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
        return true;
      }
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
    }
  }

  /**
   * Retrieves all app info files from the device and parses them into PipAppBase objects.
   *
   * @returns A list of PipAppBase objects or null if the read fails.
   */
  public async getDeviceAppInfo(): Promise<readonly PipAppBase[] | null> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return null;
    }

    try {
      const fileNameList = await this.getDirectoryFileList('APPINFO/');
      const fileNameListJson =
        fileNameList?.filter((fileName) => fileName.endsWith('.json')) ?? [];

      const apps: PipAppBase[] = [];

      for (const fileName of fileNameListJson) {
        const filePath = `APPINFO/${fileName}`;
        const fileContent = await this.pipCommandService.cmd<string>(`
          (() => {
            var fs = require("fs");
            try {
              return fs.readFile("${filePath}");
            } catch (error) {
              return JSON.stringify({ error: error.message });
            }
          })()
        `);

        if (typeof fileContent === 'string') {
          try {
            const parsed = JSON.parse(fileContent);
            if (parsed?.error) {
              logMessage(`Failed to read "${filePath}": ${parsed.error}`);
              continue;
            }
            if (parsed?.id && parsed?.name) {
              apps.push(new PipAppBase({ id: parsed.id, name: parsed.name }));
            }
          } catch {
            logMessage(`Invalid JSON in file: "${filePath}"`);
          }
        }
      }

      return apps;
    } catch (error) {
      logMessage(`Error fetching app info: ${(error as Error)?.message}`);
      return null;
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
  public async uploadZipToDevice(file: File): Promise<boolean> {
    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.entries(zip.files).filter(([_, file]) => !file.dir);
    const fileSizes = await Promise.all(
      files.map(async ([_, file]) => (await file.async('uint8array')).length),
    );
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);

    let run = 0;
    let currentFile: JSZipObject | null = null;
    let uploaded = 0;

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

      const percentDisplay = percent >= 99 ? 100 : percent;
      logMessage(`Uploading ${file.name}: ${percentDisplay}%`, run !== 0);
      run = currentFile === file ? run + 1 : 0;
      currentFile = file;
    }

    return true;
  }
}
