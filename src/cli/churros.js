#!/usr/bin/env node

'use strict';

const commander = require('commander');
const colors = require('colors');

commander
  .version('0.1.0')
  .command('init', 'initalize churros with your default properties')
  .command('test', 'run a specific set of tests')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp((txt) => { return colors.red(txt); });
  process.exit(1);
}
