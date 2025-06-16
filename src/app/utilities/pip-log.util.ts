import { pipSignals } from 'src/app/signals';

export function clearLog(): void {
  pipSignals.logMessages.set([]);
}

export function logLink(message: string, url: string): void {
  pipSignals.logMessages.update((log) => [...log, { message, url }]);
}

export function logMessage(message: string, removeLast = false): void {
  pipSignals.logMessages.update((log) => {
    // Remove last entry if `removeLast` is true
    if (removeLast && log.length > 0) {
      log.pop();
    }
    return [...log, { message }];
  });
}
