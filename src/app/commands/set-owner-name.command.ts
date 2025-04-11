export function setOwnerName(name: string): string {
  const safeName = name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\u0020-\u007E]/g, '');

  return `
    (() => {
      try {
        settings.userName = '';
        saveSettings();
        settings.userName = ${JSON.stringify(safeName)};
        saveSettings();
        return true;
      } catch (e) {
        return false;
      }
    })();
  `;
}
