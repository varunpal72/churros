/** @module props */
'use strict';

const tools = require('core/tools');
const logger = require('winston');

let config = {};

var exports = module.exports = (initConfig) => {
  // if no config was passed in, then stop
  if (!initConfig) tools.logAndThrow('Cannot initialize props with empty config.');
  config = initConfig;

  const missingPropForRootKey = (rootKey, key) => {
    const msg = `Missing required property '${key}' for '${rootKey}'\n   Note: Can set this property by calling 'churros props ${rootKey}:${key} <value>'`;
    throw Error(msg);
  };

  exports.get = (key) => {
    var value = config[key];
    if (value) return value;

    // right now, if a property isn't found we just fail immediately.  long term, we want to add the ability to run in
    // '--prompt' mode, which will prompt the user for a value to use.
    const msg = `No value found for required property '${key}'\n   Note: Can set this property by calling 'churros props ${key} <value>'`;
    throw Error(msg);
  };

  exports.getOptional = (key) => config[key];

  exports.getForKey = (rootKey, key) => {
    const elementProps = config[rootKey];
    if (!elementProps) missingPropForRootKey(rootKey);

    const value = elementProps[key];
    if (!value) missingPropForRootKey(rootKey, key);
    return value;
  };

  exports.getOptionalForKey = (rootKey, key) => {
    logger.debug('Looking for optional property %s:%s', rootKey, key);
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
    logger.debug('Looking for props for %s', element);
    if (!config[element]) {
      const msg = `No properties found for element '${element}'\n   Note: Can setup properties for this element by calling 'churros props ${element}:my.config.key <value>'`;
      throw Error(msg);
    }

    const response = {};
    Object.keys(config[element]).forEach(c => response[c] = config[element][c]);
    return response;
  };

  return exports;
};
