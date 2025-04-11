export function installBootloader(): string {
  return `
    (() => {
      try {
        require("Storage").write(".boot0", \`
          E.on("init", function () {
            require("fs")
              .readdir("USER_BOOT")
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
