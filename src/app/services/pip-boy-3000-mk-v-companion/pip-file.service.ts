import JSZip, { JSZipObject } from 'jszip';
import { Commands } from 'src/app/commands';
import { pipSignals } from 'src/app/signals';
import { wait } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { Branch } from 'src/app/types/branch';
import { CmdDefaultResult } from 'src/app/types/cmd-default-result';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipCommandService } from './pip-command.service';
import { PipConnectionService } from './pip-connection.service';

/**
 * A service for handling files, apps, directories and other file-related
 * items on the device.
 */
@Injectable({ providedIn: 'root' })
export class PipFileService {
  private readonly pipCommandService = inject(PipCommandService);
  private readonly pipConnectionService = inject(PipConnectionService);

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
    const nodes: Branch[] = [];
    let offset = 0;
    const pageSize = 20;

    while (true) {
      const command = Commands.dirList(escapedPath, offset, pageSize);
      const result = await this.pipCommandService.run<{
        s: boolean; // success
        e: Array<[string, 'f' | 'd']>; // entries
        m: string; // message
      }>(command);

      const errorMsg = result?.m?.toUpperCase?.() ?? '';
      if (!result?.s) {
        if (!errorMsg.includes('NO_PATH') && !errorMsg.includes('NO_FILE')) {
          logMessage(`Failed to list "${dir}": ${result?.m}`);
        }
        break;
      }

      // Add received entries to list
      for (const [name, type] of result.e) {
        if (log) logMessage(`${type} - ${name}`);
        nodes.push({
          name,
          path: `${dir}/${name}`,
          type: type === 'd' ? 'dir' : 'file',
        });
      }

      if (result.e.length < pageSize) {
        // Last page (fewer entries than page size)
        break;
      }

      offset += pageSize;
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

  private async tryDeleteIfExists(path: string): Promise<void> {
    try {
      const res = await this.deleteFileOnDevice(path);
      if (!res?.success) {
        // benign: file may not exist — ignore NO_PATH/NO_FILE
        const msg = (res?.message || '').toUpperCase();
        if (!msg.includes('NO_PATH') && !msg.includes('NO_FILE')) {
          // eslint-disable-next-line no-console
          console.debug('[sendFileToDevice] pre-delete warning:', res?.message);
        }
      }
    } catch (e) {
      // ignore — pre-delete is a best-effort
      // eslint-disable-next-line no-console
      console.debug('[sendFileToDevice] pre-delete threw (ignored):', e);
    }
  }

  /**
   * Sends a single file to the device with adaptive retries.
   *
   * @note This code was guided and commented by co-pilot to mimick the
   * original Pip-Boy upload logic as closely as possible.
   */
  public async sendFileToDevice(
    path: string,
    fileData: Uint8Array,
    onProgress?: (progress: number) => void,
  ): Promise<number> {
    // Ensure single in-flight upload from this service
    while (this.isUploading) {
      await wait(50);
    }
    this.isUploading = true;

    try {
      if (!this.pipConnectionService.connection?.isOpen) {
        logMessage('Please connect to the device first.');
        return 0;
      }

      await this.tryDeleteIfExists(path);

      // Convert to binary string once (espruinoSendFile expects this)
      const binaryString = this.uint8ArrayToBinaryString(fileData);

      // Start fast; on failures reduce chunk size and enable ACKs.
      interface Plan {
        chunkSize: number;
        noACK: boolean;
      }
      const plans: Plan[] = [
        { chunkSize: 1024, noACK: true }, // fast path
        { chunkSize: 768, noACK: true },
        { chunkSize: 512, noACK: true },
        { chunkSize: 512, noACK: false }, // flip to ACK
        { chunkSize: 384, noACK: false },
        { chunkSize: 256, noACK: false },
      ];

      const MAX_RETRIES_PER_PLAN = 2; // per plan before moving to the next
      let lastErr: unknown;

      for (let i = 0; i < plans.length; i++) {
        const plan = plans[i];

        for (let attempt = 0; attempt <= MAX_RETRIES_PER_PLAN; attempt++) {
          // Exponential backoff between retries inside a plan (except first try)
          if (attempt > 0) {
            const backoff = Math.min(2000, 150 * Math.pow(1.8, attempt - 1));
            await wait(backoff);
          }

          try {
            await this.pipConnectionService.connection.espruinoSendFile(
              path,
              binaryString,
              {
                fs: true,
                chunkSize: plan.chunkSize,
                noACK: plan.noACK,
                progress: (chunkNo: number, chunkCount: number) => {
                  if (onProgress) {
                    const percent = Math.round((chunkNo / chunkCount) * 100);
                    onProgress(percent);
                  }
                },
              },
            );

            // Small settle lets the device flush FS before next command
            await wait(200);
            return fileData.length; // success
          } catch (err) {
            lastErr = err;

            // Classify transient errors that merit retry
            const msg =
              typeof err === 'string'
                ? err
                : (err as Error)?.message || String(err);

            const transient =
              msg.includes('NAK') ||
              msg.includes('Writable stream is locked') ||
              msg.includes('Failed to list') ||
              msg.includes('NetworkError') || // port hiccup during send
              msg.includes('undefined');

            // Log once per failure (debug-level)
            // eslint-disable-next-line no-console
            console.debug(
              `[sendFileToDevice] plan=${i} attempt=${attempt} ` +
                `(chunk=${plan.chunkSize}, noACK=${plan.noACK}) failed:`,
              msg,
            );

            if (!transient && attempt === MAX_RETRIES_PER_PLAN) {
              // Non-transient — bail out of the whole loop
              logMessage(`Upload failed for ${path}: ${msg}`);
              return 0;
            }

            // If port quietly closed, surface a clear failure now
            if (!this.pipConnectionService.connection?.isOpen) {
              logMessage(`Upload failed for ${path}: connection closed.`);
              return 0;
            }

            // Otherwise loop to retry; if we exhaust retries for this plan,
            // we'll fall through to the next (smaller chunks / ACK on).
          }
        }
        // Moving to next (more conservative) plan, tiny pause helps
        await wait(120);
      }

      // Exhausted all plans
      logMessage(
        `Upload failed for ${path}: ${
          typeof lastErr === 'string'
            ? lastErr
            : (lastErr as Error)?.message || 'Unknown error'
        }`,
      );
      console.error('Upload error detail:', lastErr);
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
  public async uploadZipToDevice(
    file: File,
    showLargeFileWarning = true,
  ): Promise<boolean> {
    logMessage('Preparing Zip file...');

    const zipData = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(zipData);
    const files = Object.entries(zip.files).filter(([_, file]) => !file.dir);
    const fileSizes = await Promise.all(
      files.map(async ([_, file]) => (await file.async('uint8array')).length),
    );
    const totalSize = fileSizes.reduce((acc, size) => acc + size, 0);

    const ensureDirectoryExists = async (
      fullPath: string,
    ): Promise<boolean> => {
      const parts = fullPath.split('/');
      let currentPath = '';
      for (const part of parts) {
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        const created = await this.createDirectoryIfNonExistent(currentPath);
        if (!created) {
          logMessage(`Failed to create directory "${currentPath}"`);
          return false;
        }
      }
      return true;
    };

    let run = 0;
    let currentFile: JSZipObject | null = null;
    let uploaded = 0;

    for (const [originalPath, file] of files) {
      if (showLargeFileWarning) {
        if (originalPath.toLowerCase().endsWith('.wav')) {
          logMessage(`Detected WAV file upload, this may take a while...`);
        } else if (originalPath.toLowerCase().endsWith('.avi')) {
          logMessage(`Detected AVI file upload, this may take a while...`);
        }
      }

      // Adjust path if it ends with .min.js
      const adjustedPath = originalPath.endsWith('.min.js')
        ? originalPath.replace(/\.min\.js$/, '.js')
        : originalPath;

      const directory = adjustedPath.substring(
        0,
        adjustedPath.lastIndexOf('/'),
      );
      if (directory) {
        const created = await ensureDirectoryExists(directory);
        if (!created) {
          return false;
        }
      }

      const fileData = await file.async('uint8array');
      const uploadedSize = await this.sendFileToDevice(adjustedPath, fileData);
      if (uploadedSize === 0) {
        logMessage(`Failed to upload ${adjustedPath}. Aborting.`);
        return false;
      }

      uploaded += uploadedSize;
      const percent = Math.round((uploaded / totalSize) * 100);
      pipSignals.updateProgress.set(percent);

      const percentDisplay = percent >= 99 ? 100 : percent;
      logMessage(`Uploading ${adjustedPath}: ${percentDisplay}%`);
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
