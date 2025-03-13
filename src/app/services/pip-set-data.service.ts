import { firstValueFrom } from 'rxjs';

import { Injectable } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

@Injectable({ providedIn: 'root' })
export class PipSetDataService {
  public constructor(
    private readonly commandService: PipCommandService,
    private readonly deviceService: PipDeviceService,
    private readonly pipTimeService: PipTimeService,
  ) {}

  public async setDateTimeCurrent(): Promise<void> {
    const currentDateTime = await firstValueFrom(
      this.pipTimeService.timeChanges,
    );
    const timestampSeconds = currentDateTime.toSeconds();
    const timezoneOffset = currentDateTime.offset / 60;

    const result: { success: boolean; message?: unknown } | null = await this
      .commandService.cmd(`
      (() => {
        try {
          setTime(${timestampSeconds});
          E.setTimeZone(${timezoneOffset});
          settings.timezone = ${timezoneOffset};
          settings.century = 20;
          saveSettings();
          tm0 = null;
          if (typeof drawFooter === 'function') drawFooter();
          return { success: true };
        } catch (e) {
          return { 
            message: e || 'Failed to set time.',
            success: false,
          };
        }
      })()
    `);

    if (result?.success) {
      const timeFormatted = currentDateTime.toFormat('yyyy-MM-dd h:mm:ss a');
      logMessage(`Date and time set to ${timeFormatted}.`);
    } else {
      logMessage(
        'Failed to set date and time to current with error: ' +
          `${String(result?.message) || 'Unknown error'}`,
      );
    }
  }

  public async setOwnerName(name: string | null): Promise<void> {
    name =
      name
        ?.normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\u0020-\u007E]/g, '') ?? null;

    if (!name) {
      logMessage('Invalid owner name.');
      return;
    }

    const success = await this.commandService.cmd(`
      (() => {
        try {
          settings.userName = '';
          saveSettings();
          settings.userName = '${name}';
          saveSettings();
          return true;
        } catch (e) {
          return false;
        }
      })()
    `);
    if (success) {
      pipSignals.ownerName.set(name);
      logMessage(`Owner set to: ${name}`);
      await this.deviceService.restart();
    } else {
      logMessage('Failed to set owner name.');
    }
  }

  public async resetOwnerName(): Promise<void> {
    const success = await this.commandService.cmd(`
      (() => {
        try {
          settings.userName = '';
          saveSettings();
          delete settings.userName;
          saveSettings();
          return true;
        } catch (e) {
          return false;
        }
      })()
    `);
    if (success) {
      pipSignals.ownerName.set('<NONE>');
      logMessage('Owner name reset!');
      await this.deviceService.restart();
    } else {
      logMessage('Failed to reset owner name.');
    }
  }
}
