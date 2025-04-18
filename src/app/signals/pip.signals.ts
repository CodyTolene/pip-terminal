import { signal } from '@angular/core';

import { PipAppBase } from 'src/app/models/pip-app.model';

export const pipSignals = {
  batteryLevel: signal<number>(0),
  currentDeviceAppList: signal<readonly PipAppBase[]>([]),
  deviceId: signal<string | null>(null),
  disableAllControls: signal<boolean>(false),
  firmwareVersion: signal<string | null>(null),
  isConnected: signal<boolean>(false),
  isSleeping: signal<boolean | 'BUSY'>(false),
  isUploadingFile: signal<boolean>(false),
  javascriptVersion: signal<number | null>(null),
  logMessages: signal<LogEntry[]>([]),
  ownerName: signal<string>('<NONE>'),
  progress: signal<number>(0),
  sdCardMbSpace: signal<CardStats>({ freeMb: 0, totalMb: 0 }),
  updateProgress: signal<number>(0),
};
