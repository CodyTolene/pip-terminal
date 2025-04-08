export function stopAllSounds(): string {
  return `
    (() => {
      try {
        // Stop any existing audio
        if (Pip.audioStop) {
          Pip.audioStop();
        }

        // Stop the radio if it's playing
        if (Pip.radioOn) {
          rd.enable(false);
          Pip.radioOn = false;
        }

        return true;
      } catch {
        return false;
      }
    })();
  `;
}
