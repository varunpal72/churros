'use strict';

const logger = require('winston');
const portfinder = require('portfinder');

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
exports.getOpenPort = () => {
  return new Promise((res, rej) => {
    portfinder.getPort((err, port) => {
      if (err) rej(err);
      res(port);
    });
  });
};
