export function readRawFile(path: string): string {
  return `
    (() => {
      var fs = require("fs");
      try {
        var content = fs.readFile(${JSON.stringify(path)});
        return content;
      } catch (error) {
        return JSON.stringify({ error: error.message });
      }
    })();
  `;
}
