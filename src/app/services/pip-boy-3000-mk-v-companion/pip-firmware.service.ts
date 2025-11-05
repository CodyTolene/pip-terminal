import JSZip from 'jszip';
import { wait } from 'src/app/utilities';

import { Injectable, inject } from '@angular/core';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipCommandService } from './pip-command.service';
import { PipDeviceService } from './pip-device.service';

@Injectable({ providedIn: 'root' })
export class PipFirmwareService {
  private readonly cmd = inject(PipCommandService);
  private readonly device = inject(PipDeviceService);

  /** Ensure ZIP has both fwupdate.js and pipboy.bin, then run updateFirmware() on device. */
  public async flashFullRelease(zipFile: File): Promise<void> {
    const zip = await JSZip.loadAsync(await zipFile.arrayBuffer());
    const has = (p: string): boolean =>
      !!zip.files[p] || !!zip.files[p.replace(/^\//, '')];

    if (!has('fwupdate.js') || !has('pipboy.bin')) {
      throw new Error('ZIP must contain pipboy.bin and fwupdate.js');
    }

    await this.device.clearScreen('Finishing upgrade on device...');
    // Load the flasher into memory, then start it
    await this.cmd.run<void>(
      String.raw`eval(require('fs').readFileSync('fwupdate.js'));`,
    );
    await wait(200);
    await this.cmd.run<void>('updateFirmware();');

    // Nominal reflash timing
    const NOMINAL_REFLASH_SECS = 55;
    for (let s = NOMINAL_REFLASH_SECS; s > 0; s--) {
      logMessage(`Reflashing... ~${s}s remaining`);
      await wait(1000);
    }

    await this.device.clearScreen('Upgrade complete. Rebooting Pip-Boy...');
    await this.device.restart();
  }
}
