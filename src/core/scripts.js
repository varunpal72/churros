'use strict';

const fs = require('fs');

module.exports.runFile = (element, filePath, method) => {
  return new Promise(function(resolve, reject) {
    if (fs.existsSync(filePath)) {
        const script = require(filePath);
        resolve(script(element, method));
    } else {
      resolve(null);
    }
  });
};
