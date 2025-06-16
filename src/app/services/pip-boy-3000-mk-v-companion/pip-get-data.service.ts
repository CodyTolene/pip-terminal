import { Commands } from 'src/app/commands';
import { isNonEmptyObject, toNumber } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-boy-3000-mk-v-companion/pip-command.service';

import { logMessage } from 'src/app/utilities/pip-log.util';

/**
 * Service for interacting with the Pip device to retrieve various data.
 */
@Injectable({ providedIn: 'root' })
export class PipGetDataService {
  public constructor(private readonly pipCommandService: PipCommandService) {}

  public async getBatteryLevel(): Promise<number> {
    const command = Commands.getBatteryLevel();
    const result = await this.pipCommandService.run<string>(command);
    const batteryLevel = Number(result);

    if (isNaN(batteryLevel)) {
      throw new Error(`Invalid battery level: ${result}`);
    }

    return batteryLevel;
  }

  public async getFirmwareVersion(): Promise<string> {
    const command = Commands.getFirmwareVersion();
    const result = await this.pipCommandService.run<string>(command, {
      flushReceived: true,
    });

    if (typeof result !== 'string') {
      throw new Error('Invalid firmware version');
    }

    return result.trim();
  }

  public async getJavascriptVersion(): Promise<number> {
    const command = Commands.getJavascriptVersion();
    const result = await this.pipCommandService.run<string>(command);

    if (typeof result !== 'string') {
      throw new Error('Invalid owner name');
    }

    // Convert string (ie "1.29") to number (ie 1.29)
    const version = toNumber(result);
    if (version === null) {
      throw new Error('Invalid javascript version');
    }

    return version;
  }

  public async getOwnerName(): Promise<string> {
    const command = Commands.getOwnerName();
    const result = await this.pipCommandService.run<string | unknown>(command);

    if (typeof result !== 'string') {
      throw new Error('Invalid owner name');
    }

    return result;
  }

  public async getId(): Promise<string> {
    const command = Commands.getId();
    const result = await this.pipCommandService.run<string | unknown>(command);

    if (typeof result !== 'string') {
      throw new Error('Invalid device ID');
    }

    return result;
  }

  public async getIsSleeping(): Promise<boolean | 'BUSY'> {
    const command = Commands.getIsSleeping();
    const result = await this.pipCommandService.run<boolean | 'BUSY'>(command);

    if (result === null) {
      logMessage('Failed to fetch sleeping state.');
      return false;
    } else if (result === 'BUSY') {
      return 'BUSY';
    }
    return !!result;
  }

  public async getSDCardStats(): Promise<CardStats> {
    const command = Commands.getSDCardStats();
    const result = await this.pipCommandService.run<string>(command);

    if (!isNonEmptyObject(result)) {
      throw new Error(`Invalid SD card response: ${result}`);
    }

    try {
      const parsedResult = JSON.parse(result);
      return {
        totalMb: Number(parsedResult.totalMb),
        freeMb: Number(parsedResult.freeMb),
      };
    } catch (error) {
      throw new Error(`Invalid SD card response: ${error}`);
    }
  }
}
