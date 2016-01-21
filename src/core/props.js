'use strict';

const config = require(process.env.HOME + '/.churros/sauce.json');

var exports = module.exports = {};

const missingPropForElement = (element, key) => {
  console.log("Missing required property '%s' for element '%s'\n   Note: Can set this property by calling 'churros props %s:%s <value>'", key, element, element, element, key);
  process.exit(1);
};

exports.get = (key) => {
  var value = config[key];
  if (value) return value;

  // right now, if a property isn't found we just fail immediately.  long term, we want to add the ability to run in
  // '--prompt' mode, which will prompt the user for a value to use.
  console.log("No value found for required property '%s'\n   Note: Can set this property by calling 'churros props %s <value>'", key, key);
  process.exit(1);
};

exports.getForElement = (element, key) => {
  const elementProps = config[element];
  if (!elementProps) missingPropForElement(element);

  const value = elementProps[key];
  if (!value) missingPropForElement(element, key);
  return value;
};

exports.set = (key, value) => {
  config[key] = value;
};

exports.all = (element) => {
  if (!config[element]) {
    console.log("No properties found for element '%s'\n   Note: Can setup properties for this element by calling 'churros props %s:my.config.key <value>'", element, element);
    process.exit(1);
  }

  const response = {};
  Object.keys(config[element]).forEach(c => {
    response[c] = config[element][c];
  });
  return response;
};
