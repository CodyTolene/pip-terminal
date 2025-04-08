export function enterSleepMode(): string {
  return `
    (() => { 
      Pip.sleeping = true; 
      Pip.offOrSleep({ immediate: false, forceOff: false, playWebsiteSound: true }); 
    })();
  `;
}
