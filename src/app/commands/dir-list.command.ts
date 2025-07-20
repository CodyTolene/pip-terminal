export function dirList(directory: string, offset = 0, limit = 20): string {
  return `
    (() => {
      var fs = require("fs");

      function resolvePath(dir, file) {
        if (dir === "/" || dir === "") return "/" + file;
        return dir + "/" + file;
      }

      var entries = [];
      try {
        var list = fs.readdir(${JSON.stringify(directory)});
        list.slice(${offset}, ${offset} + ${limit}).forEach(function(name) {
          var full = resolvePath(${JSON.stringify(directory)}, name);
          try {
            var stat = fs.statSync(full);
            entries.push([name, stat.dir ? "d" : "f"]); // tuple: [name, type]
          } catch (_) {}
        });

        return {
          s: true,
          e: entries,
          m: "Listed " + entries.length + " entries."
        };
      } catch (e) {
        return {
          s: false,
          e: [],
          m: "Failed to read: " + e.message
        };
      }
    })();
  `;
}
