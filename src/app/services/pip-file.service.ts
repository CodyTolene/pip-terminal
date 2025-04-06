import JSZip, { JSZipObject } from 'jszip';
import { PipCommandsEnum } from 'src/app/enums';
import { wait } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { PipAppBase } from 'src/app/models/pip-app.model';

import { PipCommandService } from 'src/app/services/pip-command.service';

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

  private isInitialized = false;
  private isUploading = false;

  private commandScripts: {
    createDir: string;
    deleteDir: string;
    listDir: string;
    deleteFile: string;
    getApps: string;
  } | null = null;

  /**
   * Initializes the command scripts for file operations.
   */
  public async initialize(): Promise<void> {
    if (this.isInitialized) {
      logMessage('PipFileService is already initialized.');
      return;
    }

    const createDir = await this.pipCommandService.getCommandScript(
      PipCommandsEnum.DIR_CREATE,
    );
    if (!createDir) {
      logMessage('Error: Unable to load command DIR_CREATE.');
      return;
    }

    const deleteDir = await this.pipCommandService.getCommandScript(
      PipCommandsEnum.DIR_DELETE,
    );
    if (!deleteDir) {
      logMessage('Error: Unable to load command DIR_DELETE.');
      return;
    }

    const deleteFile = await this.pipCommandService.getCommandScript(
      PipCommandsEnum.FILE_DELETE,
    );
    if (!deleteFile) {
      logMessage('Error: Unable to load command FILE_DELETE.');
      return;
    }

    const listDir = await this.pipCommandService.getCommandScript(
      PipCommandsEnum.DIR_LIST,
    );
    if (!listDir) {
      logMessage('Error: Unable to load command DIR_LIST.');
      return;
    }

    const getApps = await this.pipCommandService.getCommandScript(
      PipCommandsEnum.GET_APPS,
    );
    if (!getApps) {
      logMessage('Error: Unable to load command GET_APPS.');
      return;
    }

    this.commandScripts = {
      createDir,
      deleteDir,
      deleteFile,
      getApps,
      listDir,
    };

    this.isInitialized = true;
  }

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
      const command = this.commandScripts?.createDir.replace(
        /DIRECTORY/g,
        JSON.stringify(directory),
      );
      if (!command) {
        logMessage(
          `Error: Unable to load command ${PipCommandsEnum.DIR_CREATE}.`,
        );
        return false;
      }

      const result = await this.pipCommandService.cmd<CreateDirResult>(command);

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

  /**
   * Deletes the directory and all its contents on the device.
   *
   * @param directory The directory to delete.
   * @returns True if the directory was deleted successfully, false otherwise.
   */
  public async deleteDirectoryOnDevice(directory: string): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return false;
    }

    try {
      const command = this.commandScripts?.deleteDir.replace(
        /DIRECTORY/g,
        JSON.stringify(directory),
      );
      if (!command) {
        logMessage(
          `Error: Unable to load command ${PipCommandsEnum.DIR_DELETE}.`,
        );
        return false;
      }

      const result = await this.pipCommandService.cmd<{
        success: boolean;
        message: string;
      }>(command);

      if (!result?.success) {
        logMessage(`Failed to delete "${directory}":`);
        logMessage(result?.message || 'Unknown error');
        return false;
      } else {
        logMessage(result.message);
        return true;
      }
    } catch (error) {
      const errorMessage = `Error deleting directory: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
    }
  }

  /**
   * Deletes a file on the device.
   *
   * @param file The name of the file to delete (e.g., "MyFile.js").
   * @param dir The directory where the file is located (e.g., "USER").
   * @returns True if the file was deleted successfully, false otherwise.
   */
  public async deleteFileOnDevice(path: string): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return false;
    }

    try {
      const command = this.commandScripts?.deleteFile.replace(
        /PATH/g,
        JSON.stringify(path),
      );
      if (!command) {
        logMessage(
          `Error: Unable to load command ${PipCommandsEnum.FILE_DELETE}.`,
        );
        return false;
      }

      const result = await this.pipCommandService.cmd<{
        success: boolean;
        message: string;
      }>(command);

      if (!result?.success) {
        logMessage(
          `Failed to delete "${path}": ${result?.message || 'Unknown error'}`,
        );
        return false;
      } else {
        // logMessage(result.message);
        return true;
      }
    } catch (error) {
      const errorMessage = `Error deleting file: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return false;
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
    const command = this.commandScripts?.listDir.replace(
      /DIRECTORY/g,
      JSON.stringify(escapedPath),
    );
    if (!command) {
      logMessage(`Error: Unable to load command ${PipCommandsEnum.DIR_LIST}.`);
      return [];
    }

    const result = await this.pipCommandService.cmd<{
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

    if (!result?.success) {
      logMessage(`Failed to list "${dir}": ${result?.message}`);
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
      const fileMetaList = await this.getBranch('APPINFO/');
      const fileMetaListJson =
        fileMetaList?.filter((fileMeta) => fileMeta.path.endsWith('.json')) ??
        [];

      const apps: PipAppBase[] = [];

      for (const fileName of fileMetaListJson.map(
        (fileMeta) => fileMeta.name,
      )) {
        const filePath = `APPINFO/${fileName}`;
        const command = this.commandScripts?.getApps.replace(
          /FILEPATH/g,
          JSON.stringify(filePath),
        );
        if (!command) {
          logMessage(
            `Error: Unable to load command ${PipCommandsEnum.GET_APPS}.`,
          );
          return [];
        }

        const fileContent = await this.pipCommandService.cmd<string>(command);

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
    const walk = async (path: string): Promise<Branch[]> => {
      const branches = await this.getBranch(path, log);
      const tree: Branch[] = [];

      for (const branch of branches) {
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
      const result = await this.pipCommandService.cmd<string>(`
        (() => {
          var fs = require("fs");
          try {
            var content = fs.readFile("${path}");
            return content;
          } catch (error) {
            return JSON.stringify({ error: error.message });
          }
        })()
      `);

      // Check if it returned an error message
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
   * @param fileData The file data to send.
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

      await wait(200);

      return fileData.length;
    } catch (error) {
      logMessage(`Upload failed for ${path}: ${(error as Error)?.message}`);
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
