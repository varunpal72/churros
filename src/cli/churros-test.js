'use strict';

const path = require('path');
const commander = require('commander');
const util = require('util');
const config = require(process.env.HOME + '/.churros/churros.json');
const shell = require('shelljs');

commander
  .option('-s, --suite <suite>', 'The suite(s) of tests to run')
  .option('-t, --test <test>', 'The specific test(s) to run', '')
  .option('-u, --user <user>', '', '')
  .option('-p, --password <password>', '', '')
  .option('-r, --url <url>', '', '')
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ churros test formulas');
    console.log('    $ churros test formulas --suite formulas.instances --suite formulas.triggers');
    console.log('    $ churros test formulas --suite formulas.instances --suite formulas.triggers --test *file* --test *other*');
    console.log('');
  })
  .parse(process.argv);

const user = commander.user || config.user;
const password = commander.password || config.password;
const url = commander.url || config.url;

const setup = path.dirname(require.main.filename) + '/../test/setup';
const suite = path.dirname(require.main.filename) + '/../test/' + commander.suite;
const args = util.format('--user %s --password %s --url %s --timeout 20000 --reporter spec --ui bdd', user, password, url);
const cmd = util.format('mocha %s %s %s', setup, suite, args);
shell.exec(cmd);
