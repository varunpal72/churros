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
