export function wakeDevice(): string {
  return `
    (() => {
      if (Pip.sleeping) {
        Pip.sleeping = false;
        Pip.wake();
        Pip.brightness = 20;
        Pip.addWatches();
        setTimeout(() => { Pip.fadeOn([LCD_BL, LED_RED, LED_GREEN]); }, 100);
        showMainMenu();
      }
      return Pip.sleeping;
    })();
  `;
}
