'use strict';

const winston = require('winston');
winston
  .remove(winston.transports.Console)
  .add(winston.transports.Console, { level: 'info' })
  .add(winston.transports.File, {
    filename: __dirname + '/../../churros.log',
    level: 'info'
  });

winston.info('Initializing...');

module.exports = winston;
