#!/usr/bin/env node

'use strict';

const commander = require('commander');

commander
  .version('0.4.0')
  .command('init', 'initalize churros')
  .command('add', 'add a new test suite')
  .command('test', 'run a test suite')
  .command('props', 'view/set properties')
  .parse(process.argv);
