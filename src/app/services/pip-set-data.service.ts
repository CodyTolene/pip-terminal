import { Injectable } from '@angular/core';

import { pipSignals } from '../signals/pip.signals';
import { logMessage } from '../utilities/pip-log.util';
import { PipCommandService } from './pip-command.service';
import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipSetDataService {
  public constructor(
    private readonly commandService: PipCommandService,
    private readonly deviceService: PipDeviceService,
  ) {}

  public async setOwnerName(name: string | null): Promise<void> {
    name =
      name
        ?.normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\u0020-\u007E]/g, '') ?? null;

    if (!name) {
      logMessage('⚠️ Invalid owner name.');
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
      logMessage(`✅ Owner set to: ${name}`);
      await this.deviceService.restart();
    } else {
      logMessage('❌ Failed to set owner name.');
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
      logMessage('✅ Owner name reset!');
      await this.deviceService.restart();
    } else {
      logMessage('❌ Failed to reset owner name.');
    }
  }
}
