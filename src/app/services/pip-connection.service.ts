import { EspruinoConnection, UartStatic } from 'src/global';

import { Injectable } from '@angular/core';

import { pipSignals } from 'src/app/signals/pip.signals';

import { logMessage } from 'src/app/utilities/pip-log.util';

declare const UART: UartStatic;

@Injectable({ providedIn: 'root' })
export class PipConnectionService {
  public connection: EspruinoConnection | null = null;

  public async connect(retryCount = 0, maxRetries = 10): Promise<void> {
    try {
      this.connection = await UART.connectAsync();

      if (!this.connection?.isOpen) {
        logMessage('Connection failed.');
        return this.retryOrAbort(retryCount, maxRetries);
      }

      this.setupConnectionListeners();

      logMessage('Connected!');

      pipSignals.isConnected.set(true);
    } catch (error) {
      logMessage(`Connection error: ${(error as Error)?.message}`);
    }
  }

  public async disconnect(): Promise<void> {
    if (this.connection?.isOpen) {
      try {
        await this.connection.close();
      } catch (error) {
        if (
          error instanceof TypeError &&
          error.message.includes('cancel') &&
          error.message.includes('released')
        ) {
          logMessage('Stream already released — ignoring.');
        } else {
          throw error;
        }
      }
      logMessage('Disconnected');
    }
    this.connection = null;
    pipSignals.deviceId.set(null);
    pipSignals.firmwareVersion.set(null);
    pipSignals.isConnected.set(false);
    pipSignals.isSleeping.set(false);
    pipSignals.javascriptVersion.set(null);
    pipSignals.ownerName.set('<NONE>');
    pipSignals.progress.set(0);
    pipSignals.updateProgress.set(0);
    pipSignals.batteryLevel.set(100);
  }

  private setupConnectionListeners(): void {
    if (!this.connection || !this.connection.isOpen) {
      logMessage('Failed to set up connection listeners.');
      return;
    }

    this.connection.on('close', () => this.disconnect());
    this.connection.on('error', (err) =>
      logMessage(`Connection error: ${err}`),
    );
  }

  private retryOrAbort(retryCount: number, maxRetries: number): void {
    if (retryCount < maxRetries) {
      logMessage(`Retrying connection (${retryCount + 1}/${maxRetries})...`);
      setTimeout(() => this.connect(retryCount + 1, maxRetries), 1000);
    } else {
      logMessage('Max retries reached.');
    }
  }
}
