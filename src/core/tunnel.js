'use strict';

const ngrok = require('ngrok');
const fs = require('fs');
const logger = require('winston');

var exports = module.exports = {};

const rootNgrok = `${process.env.HOME}/.ngrok2`;
const oldP = `${rootNgrok}/ngrok.yml`;
const newP = `${rootNgrok}/ngrok.yml.bak`;

/**
 * Starts a ngrok listener on the specified port
 * @param  {number} port The port to start the ngrok instance on
 * @return {object}      The ngrok object containing the publicly available URL string
 */
exports.start = (port, ngrokAuthToken) => {
  logger.debug('Attempting to start up ngrok on port %s', port);
  return new Promise((res, rej) => {
    // huge hack here, using our custom ngrok auth token, but do NOT want to override this environment's
    // default auth token, if one existed.  allows us to start up an ngrok listener in an environment
    // that is already running ngrok
    const opts = { port: port };
    var didMoveFile = false;
    if (ngrokAuthToken && fs.existsSync(oldP)) {
      fs.renameSync(oldP, newP);
      opts.authtoken = ngrokAuthToken;
      didMoveFile = true;
    }

    ngrok.connect(opts, (err, url) => {
      // move file back after tunnel has started since the "ngrok" client replaces the auth token in the file
      if (didMoveFile) fs.renameSync(newP, oldP);
      if (err) rej(err);

      logger.debug('Successfully started ngrok on port %s with url %s', port, url);
      res(url);
    });
  });
};
