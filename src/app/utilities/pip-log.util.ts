import { pipSignals } from 'src/app/signals/pip.signals';

export function clearLog(): void {
  pipSignals.logMessages.set([]);
}

export function logLink(message: string, url: string): void {
  pipSignals.logMessages.update((log) => [...log, { message, url }]);
}

export function logMessage(message: string): void {
  pipSignals.logMessages.update((log) => [...log, { message }]);
}
