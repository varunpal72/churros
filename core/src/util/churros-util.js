const util = require('util');

this.random = function () {
  return Math.random().toString(36).substring(7);
}

this.replaceWith = function (object, value) {
  Object.keys(object).forEach(function (key) {
    object[key] = util.format(object[key], value);
  });
}

this.json = function (file) {
  return require('../../../test/assets/' + file + '.json');
}
