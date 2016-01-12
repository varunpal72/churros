'use strict';

const config = require(process.env.HOME + '/.churros/churros.json');

var exports = module.exports = {};

exports.prop = config;

exports.override = function (key, value) {
  config[key] = value;
}
