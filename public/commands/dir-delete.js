(() => {
  var fs = require("fs");
  var logs = [];

  function deleteFilesRecursive(path) {
    try {
      logs.push("Reading: " + path);
      var files = fs.readdir(path);

      files.forEach(function (file) {
        if (file === "." || file === "..") return;
        var full = path + "/" + file;

        try {
          fs.readdir(full); // Check if it's a directory
        } catch (err) {
          // Not a directory, delete file
          try {
            fs.unlink(full);
            logs.push("Deleted file: " + full);
          } catch (delErr) {
            logs.push("Failed to delete file: " + full + " — " + delErr.message);
          }
        }
      });

      return true;
    } catch (e) {
      logs.push("Failed to read directory: " + path + " — " + e.message);
      return false;
    }
  }

  try {
    var ok = deleteFilesRecursive(DIRECTORY);
    return {
      success: ok,
      message: logs.join("\n")
    };
  } catch (error) {
    return { success: false, message: "Fatal error: " + error.message };
  }
})();
