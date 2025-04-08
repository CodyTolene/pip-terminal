export function fileLoad(path: string): string {
  return `
    (() => {
      var fs = require("fs");
      try {
        eval(fs.readFile(${JSON.stringify(path)}));
        return { 
          success: true,
          message: 'File "${path}" loaded successfully on device!',
        };
      } catch (error) {
        return { success: false, message: error.message };
      }
    })();
  `;
}
