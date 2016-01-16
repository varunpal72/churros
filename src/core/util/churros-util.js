'use strict';

const util = require('util');

var exports = module.exports = {};

exports.random = () => {
  return Math.random().toString(36).substring(7);
};

exports.replaceWith = (object, value) => {
  Object.keys(object).forEach(key => {
    object[key] = util.format(object[key], value);
  });
};
