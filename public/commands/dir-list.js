(() => {
  var fs = require("fs");

  function resolvePath(dir, file) {
    if (dir === "/" || dir === "") return "/" + file;
    return dir + "/" + file;
  }

  var entries = [];
  try {
    var list = fs.readdir(DIRECTORY);
    list.forEach(function(name) {
      var full = resolvePath(DIRECTORY, name);
      try {
        var stat = fs.statSync(full);
        entries.push({
          name: name,
          path: full,
          type: stat.dir ? "dir" : "file",
          size: stat.size,
          modified: stat.mtime
        });
      } catch (_) {}
    });

    return {
      success: true,
      entries: entries,
      message: "Listed " + entries.length + " entries."
    };
  } catch (e) {
    return {
      success: false,
      entries: [],
      message: "Failed to read: " + e.message
    };
  }
})();
