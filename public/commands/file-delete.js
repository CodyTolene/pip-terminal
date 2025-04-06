(() => {
  var fs = require("fs");
  try {
    // Attempt to delete the file
    fs.unlink(PATH);
    return {
      success: true,
      message: 'File "' + PATH + '" deleted successfully.'
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
})();
