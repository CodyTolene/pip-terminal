import { pipSignals } from 'src/app/signals/pip.signals';

export function clearLog(): void {
  pipSignals.logMessages.set([]);
}

export function logLink(text: string, url: string): void {
  pipSignals.logMessages.update((log) => [...log, { text, url }]);
}

export function logMessage(text: string): void {
  pipSignals.logMessages.update((log) => [...log, { text }]);
}
