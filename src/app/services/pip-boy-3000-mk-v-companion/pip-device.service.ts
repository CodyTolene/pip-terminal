import { Commands } from 'src/app/commands';
import { pipSignals } from 'src/app/signals';

import { Injectable, inject } from '@angular/core';

import { logMessage } from 'src/app/utilities/pip-log.util';
import { wait } from 'src/app/utilities/wait.util';

import { PipCommandService } from './pip-command.service';
import { PipConnectionService } from './pip-connection.service';
import { PipFileService } from './pip-file.service';
import { PipGetDataService } from './pip-get-data.service';

/**
 * Service responsible for managing device interactions, including initialization,
 * screen clearing, demo mode, factory test mode, restarting, sleep/wake operations,
 * and shutdown functionality.
 */
@Injectable({ providedIn: 'root' })
export class PipDeviceService {
  private readonly pipCommandService = inject(PipCommandService);
  private readonly pipConnectionService = inject(PipConnectionService);
  private readonly pipFileService = inject(PipFileService);
  private readonly pipGetDataService = inject(PipGetDataService);

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
      const command = Commands.clearScreen(message, messageTwo, video);
      const result = await this.pipCommandService.run<boolean>(command);
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
      const command = Commands.enterDemoMode();
      const result = await this.pipCommandService.run<string>(command);
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
      const command = Commands.enterFactoryMode();
      const result = await this.pipCommandService.run<string>(command);
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
      const timeoutMs = 100;
      const command = Commands.restartDevice(timeoutMs);
      await this.pipCommandService.run(command);
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
      const command = Commands.enterSleepMode();
      await this.pipCommandService.run(command);

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
      const command = Commands.wakeDevice();
      isAsleep = await this.pipCommandService.run<boolean | 'BUSY'>(command);

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
      const command = Commands.shutdownDevice();
      await this.pipCommandService.run(command);

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
