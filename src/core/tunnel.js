'use strict';

const ngrok = require('ngrok');
const logger = require('winston');

var exports = module.exports = {};

/**
 * Starts a ngrok listener on the specified port
 * @param  {number} port The port to start the ngrok instance on
 * @return {object}      The ngrok object containing the publicly available URL string
 */
exports.start = (port) => {
  return new Promise((res, rej) => {
    logger.debug('Attempting to start up ngrok on port %s', port);
    ngrok.connect(port, (err, url) => {
      if (err) rej(err);
      logger.debug('Successfully started ngrok on port %s with url %s', port, url);
      res(url);
    });
  });
};
