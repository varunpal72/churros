'use strict';

const logger = require('winston');

const gen = (opts, url, sigKey) => ({
  'event.notification.enabled': opts['event.notification.enabled'] || true,
  'event.notification.callback.url': url,
  'event.notification.signature.key': sigKey
});

const loadEventRequest = (element) => {
  try {
    let filename = `./assets/${element}.event.json`;
    delete require.cache[require.resolve(filename)];
    return require(filename);
  } catch (e) {
    logger.error('No %s.event.json file found in the events/assets directory.  Please create this file before this element can be tested with events', element);
    process.exit(1);
  }
};

module.exports = {
  gen: gen,
  loadEventRequest: loadEventRequest
};
