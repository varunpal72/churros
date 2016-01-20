'use strict';

const util = require('util');

var exports = module.exports = {};

exports.random = () => {
  return Math.random().toString(36).substring(7);
};
