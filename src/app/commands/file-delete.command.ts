export function fileDelete(path: string): string {
  return `
    (() => {
      var fs = require("fs");
      try {
        // Attempt to delete the file
        fs.unlink(${JSON.stringify(path)});
        return {
          success: true,
          message: 'File "${path}" deleted successfully.'
        };
      } catch (error) {
        return {
          success: false,
          message: error.message
        };
      }
    })();
  `;
}
