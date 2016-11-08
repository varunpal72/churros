/** @module core/tunnel */
'use strict';

const ngrok = require('ngrok');
const logger = require('winston');

var exports = module.exports = {};

/**
 * Starts a ngrok listener on the specified port
 * @param  {number} port The port to start the ngrok instance on
 * @return {Promise}     Resolves to the URL ngrok is running as
 */
exports.start = (port) => {
  logger.debug('Attempting to start up ngrok on port %s', port);
  return new Promise((res, rej) => {
    const opts = (typeof port === 'object') ? port : { port: port };
    ngrok.connect(opts, (err, url) => {
      if (err) {
        logger.error('Failed to startup ngrok on port %s.  Do you already have an ngrok tunnel running?  If so, please close that tunnel to run tests, or fork over some $ to ngrok, your choice.', port);
        rej(err);
      }
      logger.debug('Successfully started ngrok on port %s with url %s', port, url);
      res(url);
    });
  });
};
