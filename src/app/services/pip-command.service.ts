import { Injectable } from '@angular/core';

import { logMessage } from 'src/app/utilities/pip-log.util';

import { PipConnectionService } from './pip-connection.service';

@Injectable({ providedIn: 'root' })
export class PipCommandService {
  public constructor(
    private readonly connectionService: PipConnectionService,
  ) {}

  private readonly EVAL_TIMEOUT = 2000;
  private readonly MAX_RETRIES = 10;

  public async cmd<T>(
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
        return this.cmd<T>(command, options, retries + 1);
      }
      logMessage(`Command permanently failed.`);
      return null;
    }
  }
}
