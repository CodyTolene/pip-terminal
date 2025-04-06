(() => {
  var fs = require("fs");
  try {
    // Check if directory exists
    fs.readdir(DIRECTORY);
    return {
      success: true,
      message: 'Directory "' + DIRECTORY + '/" already exists.',
    };
  } catch (error) {
    try {
      // Attempt to create the directory
      fs.mkdir(DIRECTORY);
      return {
        success: true,
        message: 'Directory "' + DIRECTORY + '" created successfully on device.',
      };
    } catch (mkdirError) {
      return { success: false, message: mkdirError.message };
    }
  }
})();
