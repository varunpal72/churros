/** @module core/props */
'use strict';

const tools = require('core/tools');
const logger = require('winston');

let config = {};

/**
 * Initializes our properties with the given configuration
 * @param {Object} initConfig The initial properties to initialize with
 */
var exports = module.exports = (initConfig) => {
  // if no config was passed in, then stop
  if (!initConfig) tools.logAndThrow('Cannot initialize props with empty config.');
  config = initConfig;
  const missingPropForRootKey = (rootKey, key) => {
    const msg = `Missing required property '${key}' for '${rootKey}'\n   Note: Can set this property by calling 'churros props ${rootKey}:${key} <value>'`;
    throw Error(msg);
  };

  /**
   * Retrieve a required property by its key.  Throws an error if no value is found for the give nkey
   * @param {string} key The property key
   * @return {string}  The property value
   */
  exports.get = (key) => {
    var value = config[key];
    if (value) return value;

    // right now, if a property isn't found we just fail immediately.  long term, we want to add the ability to run in
    // '--prompt' mode, which will prompt the user for a value to use.
    const msg = `No value found for required property '${key}'\n   Note: Can set this property by calling 'churros props ${key} <value>'`;
    throw Error(msg);
  };

  /**
   * Retrieve an optional property by its key.
   * @param {string} key The property key
   * @return {string}  The property value or null if none exists
   */
  exports.getOptional = (key) => config[key];

  /**
   * Retrieve a required property that is underneath a specific root key.  Throws an error if no value is found for the given key.
   * @param {string} rootKey The root key (i.e. element name, etc.)
   * @param {string} key The property key
   * @return {string}  The property value
   */
  exports.getForKey = (rootKey, key) => {
    const elementProps = config[rootKey];
    if (!elementProps) missingPropForRootKey(rootKey);

    const value = elementProps[key];
    if (!value) missingPropForRootKey(rootKey, key);
    return value;
  };

  /**
   * Retrievs an optional property that is nested under the specified root key by its property key
   * @param {string} rootKey The root key (i.e. element name, etc.)
   * @param {string} key The property key
   * @return {string}  The property value or null if none exists
   */
  exports.getOptionalForKey = (rootKey, key) => {
    logger.debug('Looking for optional property %s:%s', rootKey, key);
    const elementProps = config[rootKey];
    if (!elementProps) return null;

    const value = elementProps[key];
    if (!value) return null;
    return value;
  };

  /**
   * Set a property
   * @param {string} key The property key
   * @param {string} value The property value
   */
  exports.set = (key, value) => {
    config[key] = value;
  };

  /**
   * Set a property for a specific root key
   * @param {string} rootKey The root key that this property will be nested underneath
   * @param {string} key The property key
   * @param {string} value The property value
   */
  exports.setForKey = (rootKey, key, value) => {
    if (!config[rootKey]) config[rootKey] = {};
    let elementProps = config[rootKey];
    elementProps[key] = value;
  };

  /**
   * Retrieves all properties for a given element.  Throws an error if no properties are found for the given element.
   * @param {string} element The element key
   * @return {Object}  All properties for the given element
   */
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
