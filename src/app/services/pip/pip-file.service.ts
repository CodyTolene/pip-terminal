import { isNonEmptyString } from '@proangular/pro-form';
import JSZip, { JSZipObject } from 'jszip';
import { Commands } from 'src/app/commands';
import { wait } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipCommandService } from 'src/app/services/pip/pip-command.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';

/**
 * A service for handling files, apps, directories and other file-related
 * items on the device.
 */
@Injectable({ providedIn: 'root' })
export class PipFileService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
  ) {}

  public readonly appBootDirecotory = 'USER_BOOT';
  public readonly appMainDirectory = 'USER';
  public readonly appMetaDirectory = 'APPINFO';

  private isUploading = false;

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
    log = false,
  ): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    try {
      const command = Commands.dirCreate(directory);
      const result =
        await this.pipCommandService.run<CmdDefaultResult>(command);

      if (!result?.success) {
        const error = result?.message || 'Unknown error';
        logMessage(
          `Failed to create "${directory}" directory on device: ${error}`,
        );
        return false;
      } else {
        if (log) {
          logMessage(result.message);
        }
        return true;
      }
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
    }
  }

  /**
   * Deletes the directory and all its contents on the device.
   *
   * @param directory The directory to delete.
   * @returns True if the directory was deleted successfully, false otherwise.
   */
  public async deleteDirectoryOnDevice(
    directory: string,
  ): Promise<CmdDefaultResult> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return {
        success: false,
        message: 'Not connected',
      };
    }

    // Do not delete base directories.
    if (
      directory === this.appMainDirectory ||
      directory === this.appBootDirecotory ||
      directory === this.appMetaDirectory
    ) {
      return {
        success: true,
        message: `Skipping deletion of default "${directory}" directory.`,
      };
    }

    try {
      const command = Commands.dirDelete(directory);
      let result = await this.pipCommandService.run<CmdDefaultResult>(command);

      const resultMessage = result?.message || 'Unknown error';
      if (
        resultMessage.includes('NO_PATH') ||
        resultMessage.includes('NO_FILE')
      ) {
        result = {
          success: true,
          message: `Ditrectory "${directory}" already deleted, skipping.`,
        };
      }
      if (!result?.success) {
        console.warn(
          `Failed to delete directory "${directory}". ${result?.message || 'Unknown error'}`,
        );
        return {
          success: false,
          message: result?.message || 'Unknown error',
        };
      } else {
        return result;
      }
    } catch (error) {
      const message = `Failed to delete "${directory}". ${(error as Error)?.message || 'Unknown error'}`;
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Deletes a file on the device.
   *
   * @param file The name of the file to delete (e.g., "MyFile.js").
   * @param dir The directory where the file is located (e.g., "USER").
   * @returns True if the file was deleted successfully, false otherwise.
   */
  public async deleteFileOnDevice(path: string): Promise<CmdDefaultResult> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return { success: false, message: 'Not connected' };
    }

    try {
      const command = Commands.fileDelete(path);
      let result = await this.pipCommandService.run<CmdDefaultResult>(command);

      const resultMessage = result?.message || 'Unknown error';
      if (
        resultMessage.includes('NO_PATH') ||
        resultMessage.includes('NO_FILE')
      ) {
        result = {
          success: true,
          message: `File "${path}" already deleted, skipping.`,
        };
      }
      if (!result?.success) {
        console.warn(
          `Failed to delete file "${path}". ${result?.message || 'Unknown error'}`,
        );
        return {
          success: false,
          message: result?.message || 'Unknown error',
        };
      } else {
        return result;
      }
    } catch (error) {
      const message = `Failed to delete "${path}". ${(error as Error)?.message || 'Unknown error'}`;
      return {
        success: false,
        message,
      };
    }
  }

  /**
   * Lists all entries in a directory on the device.
   *
   * @param dir The directory to list (e.g., "USER").
   * @param log Whether to log the entries to the console.
   * @returns A list of entries in the directory.
   */
  public async getBranch(dir = '', log = false): Promise<readonly Branch[]> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return [];
    }

    const escapedPath = dir.replace(/"/g, '\\"');
    const command = Commands.dirList(escapedPath);
    const result = await this.pipCommandService.run<{
      success: boolean;
      entries: Array<{
        name: string;
        path: string;
        type: 'file' | 'dir';
        size: number;
        modified: string;
      }>;
      message: string;
    }>(command);

    const errorMsg = result?.message?.toUpperCase?.() ?? '';
    if (!result?.success) {
      if (!errorMsg.includes('NO_PATH') && !errorMsg.includes('NO_FILE')) {
        logMessage(`Failed to list "${dir}": ${result?.message}`);
      }
      return [];
    }

    const nodes: Branch[] = [];

    for (const entry of result.entries) {
      if (log) logMessage(`${entry.type} - ${entry.path}`);
      nodes.push(entry);
    }

    return nodes;
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
      await this.createDirectoryIfNonExistent(this.appMetaDirectory);
      const fileMetaList = await this.getBranch(`${this.appMetaDirectory}`);
      const fileMetaListJson =
        fileMetaList?.filter((fileMeta) => fileMeta.path.endsWith('.json')) ??
        [];

      const apps: PipAppBase[] = [];

      for (const fileName of fileMetaListJson.map(
        (fileMeta) => fileMeta.name,
      )) {
        const filePath = `${this.appMetaDirectory}/${fileName}`;
        const command = Commands.getApps(filePath);
        const fileContent = await this.pipCommandService.run<string>(command);

        if (typeof fileContent === 'string') {
          try {
            const parsed = JSON.parse(fileContent);
            if (parsed?.error) {
              logMessage(`Failed to read "${filePath}": ${parsed.error}`);
              continue;
            }
            if (parsed?.id && parsed?.name) {
              apps.push(
                new PipAppBase({
                  id: parsed.id,
                  name: parsed.name,
                  version: parsed.version,
                }),
              );
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
   * Recursively lists all entries in a directory on the device.
   *
   * @note We have to recrusively walk the directories here instead
   * of on the device, so that we don't get a "stack overflow" error.
   * @param dir The root directory to list (e.g., "USER").
   * @param log Whether to log the entries to the console.
   * @returns A full, recursive list of entries in the directory.
   */
  public async getTree(dir = '', log = false): Promise<readonly Branch[]> {
    const jsVersion = pipSignals.javascriptVersion();
    if (jsVersion === null) {
      logMessage('Failed to get JavaScript version.');
      return [];
    }

    const walk = async (path: string): Promise<Branch[]> => {
      const branches = await this.getBranch(path, log);
      const tree: Branch[] = [];

      for (const branch of branches) {
        // Prevent infinite recursion caused by self referencing directories
        // introduced in Pip-Boy JS Version 1.29
        if (
          jsVersion >= 1.29 &&
          (branch.name === '.' ||
            branch.name === '..' ||
            branch.path.includes('/./') ||
            branch.path.includes('/../'))
        ) {
          continue;
        }

        if (log) logMessage(`${branch.type} - ${branch.path}`);

        if (branch.type === 'dir') {
          tree.push({
            ...branch,
            children: await walk(branch.path),
          });
        } else {
          tree.push(branch);
        }
      }

      return tree;
    };

    return walk(dir);
  }

  public async installBootloader(): Promise<CmdDefaultResult> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    try {
      const command = Commands.installBootloader();
      const result =
        await this.pipCommandService.run<CmdDefaultResult>(command);

      if (!result?.success) {
        const error = result?.message || 'Unknown error';
        logMessage(`Failed to install bootloader: ${error}`);
        return {
          success: false,
          message: error,
        };
      } else {
        return result;
      }
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return {
        success: false,
        message: errorMessage,
      };
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
      const command = Commands.fileLoad(path);
      const result =
        await this.pipCommandService.run<CmdDefaultResult>(command);

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
   * Reads and parses a JSON file from the device.
   *
   * @param path The path to the JSON file on the device (e.g., "USER/_config.json").
   * @returns The parsed JSON object or null if the read fails.
   */
  public async readJsonFileFromDevice(path: string): Promise<unknown | null> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return null;
    }

    try {
      const command = Commands.readRawFile(path);
      const result = await this.pipCommandService.run<string>(command);

      if (typeof result === 'string') {
        try {
          const parsed = JSON.parse(result);
          if (parsed?.error) {
            logMessage(`Failed to read "${path}" from device: ${parsed.error}`);
            return null;
          }
          return parsed;
        } catch {
          logMessage(`Invalid JSON in file: "${path}"`);
          return null;
        }
      }

      return null;
    } catch (error) {
      logMessage(
        `Error reading "${path}" from device: ${(error as Error)?.message}`,
      );
      return null;
    }
  }

  /**
   * Sends a single file to the device.
   *
   * @param path The path to save the file to on the device.
   * @param fileData The file data to send as a Uint8Array.
   * @param onProgress A callback with the progress percentage.
   * @returns The size of the file sent.
   */
  public async sendFileToDevice(
    path: string,
    fileData: Uint8Array,
    onProgress?: (progress: number) => void,
  ): Promise<number> {
    while (this.isUploading) {
      await wait(50); // wait before trying again
    }

    this.isUploading = true;

    const binaryString = this.uint8ArrayToBinaryString(fileData);

    try {
      await this.pipConnectionService.connection?.espruinoSendFile(
        path,
        binaryString,
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

      await wait(200);
      return fileData.length;
    } catch (error) {
      logMessage(
        `Upload failed for ${path}: ${
          isNonEmptyString(error) ? error : (error as Error)?.message
        }`,
      );
      return 0;
    } finally {
      this.isUploading = false;
    }
  }

  /**
   * Extracts and uploads a ZIP file to the Pip-Boy device.
   *
   * @param file The zip file to upload.
   * @returns Whether the upload was successful.
   */
  public async uploadZipToDevice(file: File): Promise<boolean> {
    logMessage('Preparing Zip file...');

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

  private uint8ArrayToBinaryString(bytes: Uint8Array): string {
    const chunkSize = 8192;
    const chunks = [];
    for (let i = 0; i < bytes.length; i += chunkSize) {
      chunks.push(
        String.fromCharCode.apply(
          null,
          bytes.subarray(i, i + chunkSize) as unknown as number[],
        ),
      );
    }
    return chunks.join('');
  }
}
