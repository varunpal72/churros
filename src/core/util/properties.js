'use strict';

const config = require(process.env.HOME + '/.churros/churros.json');
const prompt = require('prompt');
prompt.message = "   ";
prompt.delimiter = "";

var exports = module.exports = {};

exports.get = (key) => {
  var value = config[key];
  if (value) return value;
  console.log("No value found for required property: '%s'", key);
  process.exit(1);
}

exports.set = (key, value) => {
  config[key] = value;
}
