export function enterDemoMode(): string {
  return `
    (() => {
      try {
        // Activate demo mode
        enterDemoMode();
        return 'Demo mode activated.';
      } catch (error) {
        return 'Error: ' + error.message;
      }
    })();
  `;
}
