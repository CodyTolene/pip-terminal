import { isNonEmptyString } from '@proangular/pro-form';

import { Injectable } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';
import { wait } from 'src/app/utilities/wait.util';

import { PipCommandService } from './pip-command.service';
import { PipConnectionService } from './pip-connection.service';
import { PipGetDataService } from './pip-get-data.service';

@Injectable({ providedIn: 'root' })
export class PipDeviceService {
  public constructor(
    private readonly pipConnectionService: PipConnectionService,
    private readonly pipGetDataService: PipGetDataService,
    private readonly pipCommandService: PipCommandService,
  ) {}

  public async initialize(): Promise<void> {
    if (!this.pipConnectionService.connection) {
      throw new Error('No active connection');
    }

    pipSignals.disableAllControls.set(true);

    logMessage('Fetching device information...');

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

    pipSignals.disableAllControls.set(false);
  }

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
      const result = await this.pipCommandService.cmd<boolean>(`
        (() => {
          try {
            // Remove any UI
            Pip.remove();  
            Pip.removeSubmenu && Pip.removeSubmenu();
            
            // Stop the radio if it's playing
            if (Pip.radioOn) {
                rd.enable(false);
                Pip.radioOn = false;
            }

            // Clear the screen
            g.clear(1);

            // Set font and align text
            g.setFontMonofonto23();
            g.setFontAlign(0, 0);

            // Message(s)
            ${
              isNonEmptyString(message)
                ? `g.drawString("${message}", g.getWidth() / 2, g.getHeight() ${video ? '- 75' : '/ 2 - 10'});`
                : ''
            }
            ${
              isNonEmptyString(messageTwo)
                ? `g.drawString("${messageTwo}", g.getWidth() / 2, g.getHeight() ${video ? '- 40' : '/ 2 + 20'});`
                : ''
            }
            
            // Video
            ${video ? `Pip.videoStart("${video.filename}", { x: ${video.x}, y: ${video.y} });` : ''}

            // Force a display refresh
            g.flip();
          } catch (error) {
            return 'Error: ' + error.message;
          }
        })()
      `);

      return result ?? false;
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }

    return false;
  }

  public async demoMode(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }
    // Pip.demoMode

    logMessage('Entering demo mode...');
    pipSignals.disableAllControls.set(true);

    try {
      const result = await this.pipCommandService.cmd<string>(`
        (() => {
          try {
            enterDemoMode();
            return 'Demo mode activated.';
          } catch (error) {
            return 'Error: ' + error.message;
          }
        })()
      `);
      logMessage(result ?? 'Error: No response from device.');
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    } finally {
      pipSignals.disableAllControls.set(false);
    }
  }

  public async factoryTestMode(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
    }

    logMessage('Entering factory test mode...');
    pipSignals.disableAllControls.set(true);

    try {
      const result = await this.pipCommandService.cmd<string>(`
        (() => {
          try {
            factoryTestMode();
            return 'Factory test mode activated.';
          } catch (error) {
            return 'Error: ' + error.message;
          }
        })()
      `);

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

  public async restart(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    try {
      logMessage('Rebooting now...');
      await this.pipCommandService.cmd(
        'setTimeout(() => { E.reboot(); }, 100);',
      );
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }
  }

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

    logMessage('Sleeping now...');

    pipSignals.disableAllControls.set(true);

    try {
      await this.pipCommandService.cmd(`
        (() => { 
          Pip.sleeping = true; 
          Pip.offOrSleep({ immediate:false, forceOff:false, playSound:true }); 
        })()
      `);

      const maxRetries = 10;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await wait(1500);

        isAsleep = await this.pipGetDataService.getIsSleeping();
        logMessage(
          `Sleep check [Attempt ${attempt + 1}/${maxRetries}]: ${isAsleep}`,
        );

        if (isAsleep === true) {
          logMessage('Successfully set to sleep.');
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
      isAsleep = await this.pipCommandService.cmd<boolean | 'BUSY'>(`
        (() => {
          if (Pip.sleeping) {
            Pip.sleeping = false;
            Pip.wake();
            Pip.brightness = 20;
            Pip.addWatches();
            setTimeout(() => { Pip.fadeOn([LCD_BL, LED_RED, LED_GREEN]); }, 100);
            showMainMenu();
          }
          return Pip.sleeping;
        })()
      `);

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

  public async shutdown(): Promise<void> {
    if (!this.pipConnectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    logMessage('Shutting down...');

    pipSignals.disableAllControls.set(true);

    try {
      await this.pipCommandService.cmd(
        'Pip.offOrSleep({ immediate:false, forceOff:true, playSound:true })',
      );

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
