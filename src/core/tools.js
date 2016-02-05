'use strict';

const logger = require('winston');

var exports = module.exports = {};

exports.random = () => Math.random().toString(36).substring(7);

exports.randomInt = () => Math.floor(Math.random() * (1000 - 1 + 1)) + 1;

exports.logAndThrow = (msg, error, arg) => {
  arg ? logger.error(msg, arg) : logger.error(msg);
  throw error;
};
