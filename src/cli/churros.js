#!/usr/bin/env node

'use strict';

const commander = require('commander');

commander
  .version('1.0.0')
  .command('init', 'initalize churros')
  .command('add', 'add a new test suite')
  .command('test', 'run a test suite')
  .command('props', 'view/set properties')
  .command('clean', 'clean up platform resources')
  .parse(process.argv);
