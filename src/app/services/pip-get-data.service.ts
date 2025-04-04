import { isNonEmptyObject } from 'src/app/utilities';

import { Injectable } from '@angular/core';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipCommandService } from './pip-command.service';

/**
 * Service for interacting with the Pip device to retrieve various data.
 */
@Injectable({ providedIn: 'root' })
export class PipGetDataService {
  public constructor(private readonly commandService: PipCommandService) {}

  public async getBatteryLevel(): Promise<number> {
    const result = await this.commandService.cmd<string>(`
      (() => {
        if (typeof Pip === "undefined") return "Error: Pip object not found.";
  
        try {
          let batteryVoltage = Pip.measurePin(VBAT_MEAS);
          let minVoltage = 3.0;  // Voltage at 0% battery
          let maxVoltage = 4.2;  // Voltage at 100% battery
  
          // Calculate battery percentage
          let batteryLevel = Math.min(100, Math.max(0, ((batteryVoltage - minVoltage) / (maxVoltage - minVoltage)) * 100));
  
          console.log("Battery Voltage:", batteryVoltage.toFixed(2), "V");
          console.log("Battery Level:", batteryLevel.toFixed(0), "%");
  
          return batteryLevel.toFixed(0);
        } catch (error) {
          return "Battery measurement failed: " + error.message;
        }
      })()
    `);

    const batteryLevel = Number(result);

    if (isNaN(batteryLevel)) {
      throw new Error(`Invalid battery level: ${result}`);
    }

    return batteryLevel;
  }

  public async getFirmwareVersion(): Promise<string> {
    const result = await this.commandService.cmd<string>(
      'process.env.VERSION',
      {
        flushReceived: true,
      },
    );

    if (typeof result !== 'string') {
      throw new Error('Invalid firmware version');
    }

    return result.trim();
  }

  public async getJavascriptVersion(): Promise<string> {
    const result = await this.commandService.cmd<string>(`
      (() => {
        let s = require('Storage');
        let l = s.list();
        if (l.includes('VERSION') && l.includes('.bootcde')) return s.read('VERSION');
        return 'unknown';
      })()
    `);

    if (typeof result !== 'string') {
      throw new Error('Invalid owner name');
    }

    return result.trim();
  }

  public async getOwnerName(): Promise<string> {
    const result = (await this.commandService.cmd(
      "typeof(settings)=='object'?settings.userName||'<NONE>':'<NONE>'",
    )) as string | unknown;

    if (typeof result !== 'string') {
      throw new Error('Invalid owner name');
    }

    return result;
  }

  public async getId(): Promise<string> {
    const result = await this.commandService.cmd<string>(
      "(typeof(Pip)=='function' && Pip.getID) ? Pip.getID() : 'Unknown'",
    );

    if (typeof result !== 'string') {
      throw new Error('Invalid device ID');
    }

    return result;
  }

  public async getIsSleeping(): Promise<boolean | 'BUSY'> {
    const result = await this.commandService.cmd<boolean | 'BUSY'>(
      'Pip.sleeping',
    );

    if (result === null) {
      logMessage('Failed to fetch sleeping state.');
      return false;
    } else if (result === 'BUSY') {
      return 'BUSY';
    }
    return !!result;
  }

  public async getSDCardStats(): Promise<CardStats> {
    const result = await this.commandService.cmd<string>(`
      (() => {
        if (!Pip.isSDCardInserted()) return "Error: No SD card inserted.";
  
        try {
          let fs = require('fs');
          let stats = fs.getFree();
          let freeMb = (stats.freeSectors * stats.sectorSize) / 1e6;
          let totalMb = (stats.totalSectors * stats.sectorSize) / 1e6;
  
          return JSON.stringify({ totalMb: totalMb.toFixed(0), freeMb: freeMb.toFixed(0) });
        } catch (error) {
          return "SD card space check failed: " + error.message;
        }
      })()
    `);

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
