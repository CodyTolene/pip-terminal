(() => {
  var fs = require("fs");
  try {
    return fs.readFile(FILEPATH);
  } catch (error) {
    return JSON.stringify({ error: error.message });
  }
})()
