export function getApps(filepath: string): string {
  return `
    (() => {
      var fs = require("fs");
      try {
        return fs.readFile(${JSON.stringify(filepath)});
      } catch (error) {
        return JSON.stringify({ error: error.message });
      }
    })();
  `;
}
