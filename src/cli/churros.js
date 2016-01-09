#!/usr/bin/env node

'use strict';

const commander = require('commander');

commander
  .version('0.1.0')
  .command('init', 'initalize churros with your default properties')
  .command('test', 'run a specific set of tests')
  .parse(process.argv);

// manually validate invalid commands as they're not handle explicity https://github.com/tj/commander.js/issues/432
commander.args.forEach((arg) => {
  var isValid = false;
  commander.commands.forEach((command) => {
    if (command._name === arg) {
      isValid = true;
    }
  });
  if (!isValid) {
    commander.outputHelp();
  }
});
