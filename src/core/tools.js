/** @module core/tools */
'use strict';

const logger = require('winston');
const sleep = require('sleep');

var exports = module.exports = {};

/**
 * Generates a random string
 * @return {string} A random, 7 character string
 */
exports.random = () => Math.random().toString(36).substring(7);

/**
 * Generates a random email address in the @churros.com domain
 * @return {string} A random, 7-character email address
 */
exports.randomEmail = () => {
  var address = exports.random();
  var domain = 'churros';
  return address + '@' + domain + '.com';
};

/**
 * Generates a random integer
 * @return {int} A random integer
 */
exports.randomInt = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

/**
 * Log and throw an error
 * @param  {String} msg   The message to log
 * @param  {Error} error  The JS error to throw
 * @param  {Object} arg   Any args to pass when logging
 */
exports.logAndThrow = (msg, error, arg) => {
  arg ? logger.error(msg, arg) : logger.error(msg);
  throw error;
};

/**
 * Base 64 encode a string
 * @param {string} s The string to base 64 encode
 */
exports.base64Encode = s => new Buffer(s).toString('base64');
/**
 * Base 64 decode the given string
 * @param {string} s      The string to decode
 * @param {string} base64 The base 64 decoded string
 */
exports.base64Decode = s => new Buffer(s, 'base64').toString('ascii');

/**
 * Sleep for a certain amount of time
 * @param {int} secs The number of seconds to sleep
 */
exports.sleep = secs => {
  logger.debug(`Sleeping for ${secs} seconds`);
  sleep.sleep(secs);
};

const waitFor = max => pred => new Promise((res, rej) => {
  const doit = (ms) => {
    if (ms <= 0) {
      rej(`Predicate was not true within the maximum time allowed of ${max} ms.`);
    }

    return pred()
      .then(r => res(r))
      .then(r => res(r))
      .catch(e => setTimeout(doit, 3000, ms - 3000));
  };
  doit(max);
});

/**
 * Wait for up to a maximum number of milliseconds for a predicate to become
 * true.
 * The predicate should be a function that takes a single callback argument.
 * When the predicate determines itself to be true, it should call the callback,
 * with a return value if needed.
 * Example to wait up to 10 seconds for the predicate:
 *   wait.upTo(10000).for(cb => { if (true) { cb(); } });
 * Example to wait the default time for the predicate (15 seconds), and return
 * a value:
 *   wait.for(cb => { if (true) { cb(true); } });
 */
exports.wait = {
  upTo: max => ({
    for: waitFor(max)
  }),
  for: waitFor(15000)
};


/**
 * Stringify an object
 * @param  {object} json The JSON object to stringify
 * @return {string}      The JSON object stringified
 */
exports.stringify = (json) => JSON.stringify(json);
