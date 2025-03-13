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
    private readonly commandService: PipCommandService,
    private readonly connectionService: PipConnectionService,
    private readonly getDataService: PipGetDataService,
  ) {}

  public async initialize(): Promise<void> {
    if (!this.connectionService.connection) {
      throw new Error('No active connection');
    }

    pipSignals.disableAllControls.set(true);

    logMessage('Fetching device information...');

    pipSignals.ownerName.set(await this.getDataService.getOwnerName());
    logMessage(`Owner: ${pipSignals.ownerName()}`);

    pipSignals.firmwareVersion.set(
      await this.getDataService.getFirmwareVersion(),
    );
    logMessage(`Firmware version: ${pipSignals.firmwareVersion()}`);

    pipSignals.javascriptVersion.set(
      await this.getDataService.getJavascriptVersion(),
    );
    logMessage(`JS version: ${pipSignals.javascriptVersion()}`);

    pipSignals.deviceId.set(await this.getDataService.getId());
    logMessage(`Device ID: ${pipSignals.deviceId()}`);

    pipSignals.isSleeping.set(await this.getDataService.getIsSleeping());
    logMessage(`Sleeping: ${pipSignals.isSleeping() ? 'True' : 'False'}`);

    pipSignals.disableAllControls.set(false);
  }

  public async restart(): Promise<void> {
    if (!this.connectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    try {
      logMessage('Rebooting now...');
      await this.commandService.cmd('setTimeout(() => { E.reboot(); }, 100);');
    } catch (error) {
      logMessage(`Error: ${(error as Error)?.message}`);
    }
  }

  public async sleep(): Promise<void> {
    if (!this.connectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    let isAsleep = await this.getDataService.getIsSleeping();
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
      await this.commandService.cmd(`
        (() => { 
          Pip.sleeping = true; 
          Pip.offOrSleep({ immediate:false, forceOff:false, playSound:true }); 
        })()
      `);

      const maxRetries = 10;
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        await wait(1500);

        isAsleep = await this.getDataService.getIsSleeping();
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
    if (!this.connectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    let isAsleep: boolean | 'BUSY' | null =
      await this.getDataService.getIsSleeping();
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
      isAsleep = await this.commandService.cmd<boolean | 'BUSY'>(`
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
    if (!this.connectionService.connection?.isOpen) {
      logMessage('Please connect to the device first.');
      return;
    }

    logMessage('Shutting down...');

    pipSignals.disableAllControls.set(true);

    try {
      await this.commandService.cmd(
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

        if (!this.connectionService.connection?.isOpen) {
          shutdownSuccess();
          return;
        }

        const isBusy = (await this.getDataService.getIsSleeping()) === 'BUSY';
        logMessage(
          `Shutdown check [Attempt ${attempt + 1}/${maxRetries}]: ${isBusy ? 'BUSY' : 'OK'}`,
        );

        if (!isBusy || !this.connectionService.connection?.isOpen) {
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
