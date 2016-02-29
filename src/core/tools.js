'use strict';

const logger = require('winston');
const localtunnel = require('localtunnel');

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

exports.startTunnel = (port) => {
  return new Promise((res, rej) => {
    logger.debug('attempting to start up localtunnel on port %s', port);
    localtunnel(port, { 'local_host': '127.0.0.1' }, (err, tunnel) => {
      if (err) rej(err);
      logger.debug('successfully started localtunnel on port %s with url %s', port, tunnel.url);
      res(tunnel);
    });
  });
};
