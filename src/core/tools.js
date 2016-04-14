'use strict';

const logger = require('winston');
const sleep = require('sleep');

var exports = module.exports = {};

exports.random = () => Math.random().toString(36).substring(7);

exports.randomEmail = () => {
  var address = exports.random();
  var domain = 'churros';
  return address + '@' + domain + '.com';
};

exports.randomInt = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

exports.logAndThrow = (msg, error, arg) => {
  arg ? logger.error(msg, arg) : logger.error(msg);
  throw error;
};

exports.base64Encode = s => new Buffer(s).toString('base64');
exports.base64Decode = s => new Buffer(s, 'base64').toString('ascii');

exports.sleep = secs => {
  logger.debug(`sleeping for ${secs} seconds`);
  sleep.sleep(secs);
};

const waitFor = max => pred => new Promise((res, rej) => {
  const doit = (ms) => {
    if (ms <= 0) {
      rej(`Predicate was not true within the maximum time allowed of ${max} ms.`);
    }
    pred(res);
    setTimeout(doit, 3000, ms - 3000);
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
const wait = {
  upTo: max => ({
    for: waitFor(max)
  }),
  for: waitFor(15000)
};

exports.wait = wait;
