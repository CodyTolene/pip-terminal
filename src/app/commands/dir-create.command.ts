export function dirCreate(directory: string): string {
  return `
    (() => {
      var fs = require("fs");
      try {
        // Check if directory exists
        fs.readdir(${JSON.stringify(directory)});
        return {
          success: true,
          message: 'Directory "${directory}" already exists.',
        };
      } catch (error) {
        try {
          // Attempt to create the directory
          fs.mkdir(${JSON.stringify(directory)});
          return {
            success: true,
            message: 'Directory "${directory}" created successfully on device.',
          };
        } catch (mkdirError) {
          return { success: false, message: mkdirError.message };
        }
      }
    })();
  `;
}
