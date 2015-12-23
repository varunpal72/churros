const util = require('util');

var exports = module.exports = {};

exports.random = function () {
  return Math.random().toString(36).substring(7);
};

exports.replaceWith = function (object, value) {
  Object.keys(object).forEach(function (key) {
    object[key] = util.format(object[key], value);
  });
};
