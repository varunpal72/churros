'use strict';

const fs = require('fs');
const tools = require('core/tools');
const util = require('util');

const missingPropForRootKey = (rootKey, key) => {
  const msg = util.format("Missing required property '%s' for '%s'\n   Note: Can set this property by calling 'churros props %s:%s <value>'", key, rootKey, rootKey, key);
  throw new Error(msg);
};

var exports = module.exports = (config) => {
  const configFile = process.env.HOME + '/.churros/sauce.json';

  // if no config was passed in AND the sauce.json file does not exist, then stop
  if (!config && !fs.existsSync(configFile)) tools.logAndThrow('No props file found.  Please run churros init to get started.');
  if (!config) config = require(configFile);

  exports.get = (key) => {
    var value = config[key];
    if (value) return value;

    // right now, if a property isn't found we just fail immediately.  long term, we want to add the ability to run in
    // '--prompt' mode, which will prompt the user for a value to use.
    const msg = util.format("No value found for required property '%s'\n   Note: Can set this property by calling 'churros props %s <value>'", key, key);
    throw new Error(msg);
  };

  exports.getForKey = (rootKey, key) => {
    const elementProps = config[rootKey];
    if (!elementProps) missingPropForRootKey(rootKey);

    const value = elementProps[key];
    if (!value) missingPropForRootKey(rootKey, key);
    return value;
  };

  exports.getOptionalForKey = (rootKey, key) => {
    const elementProps = config[rootKey];
    if (!elementProps) return null;

    const value = elementProps[key];
    if (!value) return null;
    return value;
  };

  exports.set = (key, value) => {
    config[key] = value;
  };

  exports.setForKey = (rootKey, key, value) => {
    if (!config[rootKey]) config[rootKey] = {};
    let elementProps = config[rootKey];
    elementProps[key] = value;
  };

  exports.all = (element) => {
    if (!config[element]) {
      const msg = util.format("No properties found for element '%s'\n   Note: Can setup properties for this element by calling 'churros props %s:my.config.key <value>'", element, element);
      throw new Error(msg);
    }

    const response = {};
    Object.keys(config[element]).forEach(c => response[c] = config[element][c]);
    return response;
  };

  return exports;
};
