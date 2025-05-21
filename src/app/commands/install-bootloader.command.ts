export function installBootloader(): string {
  return `
    (() => {
      try {
        require("Storage").write(".boot0", \`
          E.on("init", function () {
            // Clean up any previous Pip app states before loading new scripts.
            // This ensures old intervals, listeners, or buffers are removed to 
            // prevent memory leaks.
            if (typeof Pip !== 'undefined' && typeof Pip.remove === 'function') {
              Pip.remove();
            }
            require("fs")
              .readdir("USER_BOOT")
              .sort()
              .forEach(function (f) {
                if (f.endsWith(".js")) {
                  eval(require("fs").readFile("USER_BOOT/" + f));
                }
              });
          });
        \`);
        return { success: true, message: "Bootloader installed successfully!" };
      } catch (e) {
        return { success: false, message: e.message };
      }
    })();
  `;
}
