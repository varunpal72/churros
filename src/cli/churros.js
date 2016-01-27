#!/usr/bin/env node

'use strict';

const commander = require('commander');

commander
  .version('0.1.0')
  .command('init', 'initalize churros with your default properties')
  .command('add', 'add a new test suite')
  .command('test', 'run a specific set of tests')
  .command('props', 'configure churros properties')
  .parse(process.argv);
