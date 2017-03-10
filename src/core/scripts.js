'use strict';

const fs = require('fs');

module.exports.runFile = (filePath, method) => {
  if (fs.existsSync(filePath)) {
    const script = require(filePath);
    script(method);
  }
}
