'use strict';

const config = require(process.env.HOME + '/.churros/churros.json');

var exports = module.exports = {};

exports.get = (key) => {
  var value = config[key];
  if (value) return value;

  // right now, if a property isn't found we just fail immediately.  long term, we want to add the ability to run in
  // '--prompt' mode, which will prompt the user for a value to use.
  console.log("No value found for required property: '%s'\n   Note: Can set this value by calling 'churros props %s <value>'", key, key);
  process.exit(1);
}

exports.set = (key, value) => {
  config[key] = value;
};

exports.all = (element) => {
  const response = {};
  Object.keys(config[element]).forEach(c => {
    response[c] = config[element][c];
  });
  return response;
};
