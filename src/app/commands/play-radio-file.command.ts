export function playRadioFile(radioFileName: string): string {
  return `
    (() => {
      try {
        Pip.audioStart("RADIO/${radioFileName}.wav");
        return true;
      } catch {
        return false;
      }
    })();
  `;
}
