import { PipCommandsEnum } from 'src/app/enums';

import { Injectable } from '@angular/core';

import { PipFileService } from 'src/app/services/pip-file.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';
import { wait } from 'src/app/utilities/wait.util';

import { PipCommandService } from './pip-command.service';
import { PipConnectionService } from './pip-connection.service';
import { PipGetDataService } from './pip-get-data.service';

/**
 * Service responsible for managing device interactions, including initialization,
 * screen clearing, demo mode, factory test mode, restarting, sleep/wake operations,
 * and shutdown functionality.
 */
@Injectable({ providedIn: 'root' })
export class PipDeviceService {
  public constructor(
    private readonly pipCommandService: PipCommandService,
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipFileService: PipFileService,
    private readonly pipGetDataService: PipGetDataService,
  ) {}

  /**
   * Initializes the device by retrieving and setting various device information,
   * such as owner name, firmware version, JavaScript version, device ID, sleep state,
   * battery level, SD card stats, and installed apps.
   *
   * @throws Error if there is no active connection to the device.
   */
  public async initialize(): Promise<void> {
    if (!this.pipConnectionService.connection) {
      throw new Error('No active connection');
    }

    pipSignals.disableAllControls.set(true);

    logMessage('Loading device information...');

    pipSignals.ownerName.set(await this.pipGetDataService.getOwnerName());
    logMessage(`Owner: ${pipSignals.ownerName()}`);

    pipSignals.firmwareVersion.set(
      await this.pipGetDataService.getFirmwareVersion(),
    );
    logMessage(`Firmware version: ${pipSignals.firmwareVersion()}`);

    pipSignals.javascriptVersion.set(
      await this.pipGetDataService.getJavascriptVersion(),
    );
    logMessage(`JS version: ${pipSignals.javascriptVersion()}`);

    pipSignals.deviceId.set(await this.pipGetDataService.getId());
    logMessage(`Device ID: ${pipSignals.deviceId()}`);

    pipSignals.isSleeping.set(await this.pipGetDataService.getIsSleeping());
    logMessage(`Sleeping: ${pipSignals.isSleeping() ? 'True' : 'False'}`);

    pipSignals.batteryLevel.set(await this.pipGetDataService.getBatteryLevel());
    logMessage(`Battery level: ${pipSignals.batteryLevel()}%`);

    const sdCardStats = await this.pipGetDataService.getSDCardStats();
    pipSignals.sdCardMbSpace.set(sdCardStats);
    logMessage(
      `SD card space: ${sdCardStats.freeMb} / ${sdCardStats.totalMb} MB`,
    );

    const deviceAppInfo = await this.pipFileService.getDeviceAppInfo();
    pipSignals.currentDeviceAppList.set(deviceAppInfo ?? []);

    pipSignals.disableAllControls.set(false);
  }

  /**
   * Clears the device screen, optionally displaying messages or playing a video.
   *
   * @param message - Optional primary message to display on the screen.
   * @param messageTwo - Optional secondary message to display on the screen.
   * @param video - Optional video configuration with filename and position.
   * @returns A promise that resolves to `true` if the screen was cleared successfully, or `false` otherwise.
   */
  public async clearScreen(
    message?: string,
    messageTwo?: string,
    video?: { filename: string; x: number; y: number },
  ): Promise<boolean> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first before clearing screen.');
      return false;
    }

    try {
      const command = PipCommandsEnum.CLEAR_SCREEN;
      let script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return false;
      }

      script = script
        .replace(/MESSAGE/g, JSON.stringify(message ?? ''))
        .replace(/MESSAGE_TWO/g, JSON.stringify(messageTwo ?? ''))
        .replace(/VIDEO/g, video ? JSON.stringify(video) : 'null');

      const result = await this.pipCommandService.cmd<boolean>(script);

      return result ?? false;
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }

    return false;
  }

  /** Activates the demo mode on the device. */
  public async demoMode(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    logMessage('Entering demo mode...');
    pipSignals.disableAllControls.set(true);

    try {
      const command = PipCommandsEnum.ENTER_DEMO_MODE;
      const script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      const result = await this.pipCommandService.cmd<string>(script);
      logMessage(result ?? 'Error: No response from device.');
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    } finally {
      pipSignals.disableAllControls.set(false);
    }
  }

  /** Activates the factory test mode on the device. */
  public async factoryTestMode(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    logMessage('Entering factory test mode...');
    pipSignals.disableAllControls.set(true);

    try {
      const command = PipCommandsEnum.ENTER_FACTORY_MODE;
      const script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      const result = await this.pipCommandService.cmd<string>(script);

      logMessage(result ?? 'Error: No response from device.');
      return;
    } catch (error) {
      const errorMessage = `Error: ${(error as Error)?.message}`;
      logMessage(errorMessage);
      return;
    } finally {
      pipSignals.disableAllControls.set(false);
    }
  }

  /** Restarts the device by issuing a reboot command. */
  public async restart(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    logMessage('Rebooting now...');

    try {
      const command = PipCommandsEnum.RESTART_DEVICE;
      let script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      const timeoutMs = 100;
      script = script.replace(/TIMEOUT_MS/g, `${timeoutMs}`);

      await this.pipCommandService.cmd(script);
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }
  }

  /** Puts the device into sleep mode. */
  public async sleep(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    let isAsleep = await this.pipGetDataService.getIsSleeping();
    if (isAsleep === true) {
      logMessage('Already sleeping.');
      pipSignals.isSleeping.set(true);
      return;
    } else if (isAsleep === 'BUSY') {
      logMessage('Pip is busy. Retrying...');
      await wait(1000);
      return this.sleep();
    }

    logMessage('Entering sleep mode...');

    pipSignals.disableAllControls.set(true);

    try {
      const command = PipCommandsEnum.ENTER_SLEEP_MODE;
      const script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      await this.pipCommandService.cmd(script);

      const maxRetries = 10;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await wait(1500);

        isAsleep = await this.pipGetDataService.getIsSleeping();
        logMessage(
          `Sleep check [Attempt ${attempt + 1}/${maxRetries}]: ${isAsleep}`,
        );

        if (isAsleep === true) {
          logMessage('Successfully set to sleep mode.');
          pipSignals.disableAllControls.set(false);
          pipSignals.isSleeping.set(true);
          return;
        } else if (isAsleep === false) {
          logMessage('Unexpected response, retrying...');
        }
      }

      logMessage('Failed to confirm sleep after multiple attempts.');
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }

    pipSignals.disableAllControls.set(false);
    pipSignals.isSleeping.set(false);
  }

  /** Wakes the device from sleep mode. */
  public async wake(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    let isAsleep: boolean | 'BUSY' | null =
      await this.pipGetDataService.getIsSleeping();
    if (isAsleep === false) {
      logMessage('Already awake.');
      pipSignals.isSleeping.set(false);
      return;
    } else if (isAsleep === 'BUSY') {
      logMessage('Pip is busy. Retrying...');
      await wait(1000);
      return this.wake();
    }

    logMessage('Waking up now...');

    pipSignals.disableAllControls.set(true);

    try {
      const command = PipCommandsEnum.WAKE_DEVICE;
      const script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      isAsleep = await this.pipCommandService.cmd<boolean | 'BUSY'>(script);

      await wait(1000);

      if (isAsleep === false) {
        logMessage('Successfully woke up.');
        pipSignals.disableAllControls.set(false);
        pipSignals.isSleeping.set(false);
        return;
      } else {
        logMessage('Failed to wake up, please try again.');
      }
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }

    pipSignals.disableAllControls.set(false);
    pipSignals.isSleeping.set(true);
  }

  /** Shuts down the device. */
  public async shutdown(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    logMessage('Shutting down...');

    pipSignals.disableAllControls.set(true);

    try {
      const command = PipCommandsEnum.SHUTDOWN_DEVICE;
      const script = await this.pipCommandService.getCommandScript(command);
      if (!script) {
        logMessage(`Error: Unable to load command ${command}.`);
        return;
      }

      await this.pipCommandService.cmd(script);

      const maxRetries = 10;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await wait(1500);

        const shutdownSuccess = (): void => {
          logMessage('Shutdown complete.');
          pipSignals.disableAllControls.set(false);
          pipSignals.isConnected.set(false);
        };

        if (!this.pipConnectionService.connection?.isOpen) {
          shutdownSuccess();
          return;
        }

        const isBusy =
          (await this.pipGetDataService.getIsSleeping()) === 'BUSY';
        logMessage(
          `Shutdown check [Attempt ${attempt + 1}/${maxRetries}]: ${isBusy ? 'BUSY' : 'OK'}`,
        );

        if (!isBusy || !this.pipConnectionService.connection?.isOpen) {
          shutdownSuccess();
          return;
        }
      }

      logMessage('Shutdown confirmation failed after multiple attempts.');
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }

    pipSignals.disableAllControls.set(false);
  }
}
