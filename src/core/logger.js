/** @module core/logger */
'use strict';

const winston = require('winston');

/**
 * Set the log level that should be applied to any console output
 * @param {string} level The log level
 */
module.exports = (level) => {
  winston
    .remove(winston.transports.Console)
    .add(winston.transports.Console, { level: level })
    .add(winston.transports.File, {
      filename: __dirname + '/../../churros.log',
      level: 'debug'
    });

  winston.debug('Initializing loggers...');
  return winston;
};
