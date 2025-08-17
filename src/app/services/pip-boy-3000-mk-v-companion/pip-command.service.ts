import { Injectable, inject } from '@angular/core';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';

/**
 * Service to execute commands on the Espruino (Pip-Boy) device.
 */
@Injectable({ providedIn: 'root' })
export class PipCommandService {
  private readonly connectionService = inject(PipConnectionService);

  private readonly EVAL_TIMEOUT = 2000;
  private readonly MAX_RETRIES = 10;

  /**
   * Executes a command on the Espruino device with retry logic.
   *
   * @param command The command to execute on the Espruino device.
   * @param options The options to pass to the command.
   * @param retries The number of retries to attempt in case of failure.
   * @returns The result of the command execution, or null if it fails
   * after the maximum number of retries.
   */
  public async run<T>(
    command: string,
    options = {},
    retries = 0,
  ): Promise<T | null> {
    const connection = this.connectionService.connection;

    if (!connection?.isOpen) throw new Error('Not connected');

    try {
      return await connection.espruinoEval<T>(command, {
        ...options,
        timeout: this.EVAL_TIMEOUT,
      });
    } catch {
      if (retries < this.MAX_RETRIES) {
        logMessage(
          `Command failed, retrying (${retries + 1}/${this.MAX_RETRIES})...`,
        );
        return this.run<T>(command, options, retries + 1);
      }
      logMessage(`Command permanently failed.`);
      return null;
    }
  }
}
