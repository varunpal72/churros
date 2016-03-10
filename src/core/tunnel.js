'use strict';

const localtunnel = require('localtunnel');
const logger = require('winston');

var exports = module.exports = {};

/**
 * Starts a localtunnel listener on the specified port
 * @param  {number} port The port to start the localtunnel instance on
 * @return {object}      The localtunnel object containing the publicly available URL string
 */
exports.start = (port) => {
  return new Promise((res, rej) => {
    logger.debug('attempting to start up localtunnel on port %s', port);
    localtunnel(port, (err, tunnel) => {
      if (err) rej(err);
      logger.debug('successfully started localtunnel on port %s with url %s', port, tunnel.url);
      res(tunnel);
    });
  });
};
