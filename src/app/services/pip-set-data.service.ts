import { DateTime } from 'luxon';
import { firstValueFrom } from 'rxjs';
import { Commands } from 'src/app/commands';

import { Injectable } from '@angular/core';

import { PipCommandService } from 'src/app/services/pip-command.service';
import { PipDeviceService } from 'src/app/services/pip-device.service';
import { PipTimeService } from 'src/app/services/pip-time.service';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

/**
 * A service for setting data on the Pip device, such as date and time,
 * owner name, and other settings.
 */
@Injectable({ providedIn: 'root' })
export class PipSetDataService {
  public constructor(
    private readonly commandService: PipCommandService,
    private readonly deviceService: PipDeviceService,
    private readonly pipTimeService: PipTimeService,
  ) {}

  /**
   * Sets the date and time on the device.
   *
   * @param dateTime The date and time to set on the device.
   */
  public async setDateTime(dateTime: DateTime<boolean>): Promise<void> {
    const timestampSeconds = dateTime.toSeconds();
    const timezoneOffsetMinutes = dateTime.offset;

    const command = Commands.setDateTime(
      timestampSeconds,
      timezoneOffsetMinutes,
    );
    const result: { success: boolean; message?: unknown } | null =
      await this.commandService.run(command);

    const timeFormatted = dateTime.toFormat('yyyy-MM-dd h:mm:ss a');
    if (result?.success) {
      logMessage(`Date and time successfully set to ${timeFormatted}.`);
    } else {
      logMessage(
        `Failed to set date and time to ${timeFormatted} with error: ` +
          `${String(result?.message) || 'Unknown error'}`,
      );
    }
  }

  /**
   * Sets the date and time on the device to the users local time.
   */
  public async setDateTimeCurrent(): Promise<void> {
    const currentDateTime = await firstValueFrom(
      this.pipTimeService.timeChanges,
    );
    const timestampSeconds = currentDateTime.toSeconds();
    const timezoneOffsetMinutes = currentDateTime.offset;

    const command = Commands.setDateTime(
      timestampSeconds,
      timezoneOffsetMinutes,
    );
    const result: { success: boolean; message?: unknown } | null =
      await this.commandService.run(command);

    const timeFormatted = currentDateTime.toFormat('yyyy-MM-dd h:mm:ss a');
    if (result?.success) {
      logMessage(`Date and time successfully set to ${timeFormatted}.`);
    } else {
      logMessage(
        `Failed to set date and time to current ${timeFormatted} with error: ` +
          `${String(result?.message) || 'Unknown error'}`,
      );
    }
  }

  /**
   * Sets the owner name on the device.
   *
   * @param name The name to set as the owner of the device.
   * @returns A promise that resolves when the owner name is set.
   */
  public async setOwnerName(name: string | null): Promise<void> {
    if (!name) {
      logMessage('Invalid owner name.');
      return;
    }

    const command = Commands.setOwnerName(name);
    const success = await this.commandService.run(command);

    if (success) {
      pipSignals.ownerName.set(name);
      logMessage(`Owner set to: ${name}`);
      await this.deviceService.restart();
    } else {
      logMessage('Failed to set owner name.');
    }
  }

  /**
   * Resets the owner name on the device to empty.
   *
   * @returns A promise that resolves when the owner name is reset.
   */
  public async resetOwnerName(): Promise<void> {
    const command = Commands.resetOwnerName();
    const success = await this.commandService.run(command);

    if (success) {
      pipSignals.ownerName.set('<NONE>');
      logMessage('Owner name reset!');
      await this.deviceService.restart();
    } else {
      logMessage('Failed to reset owner name.');
    }
  }
}
