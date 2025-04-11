export function shutdownDevice(): string {
  return `
    (() => {
      Pip.offOrSleep({ 
        immediate: false, 
        forceOff: true, 
        playSound: true 
      });
    })();
  `;
}
