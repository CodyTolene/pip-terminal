import { signal } from '@angular/core';

export const pipSignals = {
  batteryLevel: signal<number>(0),
  deviceId: signal<string | null>(null),
  disableAllControls: signal<boolean>(false),
  firmwareVersion: signal<string | null>(null),
  isConnected: signal<boolean>(false),
  isSleeping: signal<boolean | 'BUSY'>(false),
  javascriptVersion: signal<string | null>(null),
  logMessages: signal<LogEntry[]>([]),
  ownerName: signal<string>('<NONE>'),
  progress: signal<number>(0),
  updateProgress: signal<number>(0),
};
