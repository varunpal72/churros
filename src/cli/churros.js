#!/usr/bin/env node

'use strict';

const commander = require('commander');

commander
  .version('0.6.0')
  .command('init', 'initalize churros')
  .command('add', 'add a new test suite')
  .command('test', 'run a test suite')
  .command('props', 'view/set properties')
  .command('clean', 'clean up platform resources')
  .parse(process.argv);

//cleaning up if tests end early
const cleanUpFunc = () => {
  const tools = require('../core/tools');
  const request = require('sync-request');
  const cleanupData = tools.getCleanup();

  cleanupData.forEach(data => {
    const opts = {
      headers: {
        Authorization: `User ${data.secrets.userSecret}, Organization ${data.secrets.orgSecret}`
      }
    };

    request(data.method, data.url, opts);
  });
  tools.resetCleanup();
};
process.on('SIGINT', cleanUpFunc);
process.on('SIGQUIT', cleanUpFunc);
process.on('SIGTERM', cleanUpFunc);
process.on('uncaughtException', cleanUpFunc);
