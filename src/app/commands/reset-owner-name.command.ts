export function resetOwnerName(): string {
  return `
    (() => {
      try {
        settings.userName = '';
        saveSettings();
        delete settings.userName;
        saveSettings();
        return true;
      } catch (e) {
        return false;
      }
    })();
  `;
}
