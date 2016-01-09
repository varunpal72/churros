'use strict';

const commander = require('commander');
const colors = require('colors');

commander
  .parse(process.argv);

// TODO - JJW - build out the test required and non-required options into commander here

// TODO - JJW - build process should set this up a little nicer...need some guidance from rocky and t-mac on best approach
// process.env.CHURROS_ENVIRONMENT = commander.env;
// process.env.CHURROS_USERNAME = commander.user;
// process.env.CHURROS_PASSWORD = commander.password;
// process.env.CHURROS_SUITE = commander.suite;

// TODO - JJW - hacky as all get out...
// require('../../test/lifecycle');
//
// if (commander.suite !== 'all') {
//   require('../../test/' + commander.suite + '/all');
// } else {
//   require('../../test/all');
// }
