export function restartDevice(timeoutMs = 0): string {
  return `
    (() => {
      try {
        // Delay slightly and restart the device
        setTimeout(() => {
          E.reboot();
        }, ${timeoutMs});
      } catch (error) {
        return 'Error: ' + error.message;
      }
    })();
  `;
}
