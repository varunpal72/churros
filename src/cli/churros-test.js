'use strict';

const path = require('path');
const commander = require('commander');
const util = require('util');
const config = require(process.env.HOME + '/.churros/churros.json');
const shell = require('shelljs');

commander
  .option('-s, --suite <suite>', 'The suite(s) of tests to run', '')
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

var appDir = path.dirname(require.main.filename);
const dir = appDir + '/../test/lifecycle';
const user = commander.user || config.user;
const password = commander.password || config.password;
const url = commander.url || config.url;

const args = util.format('%s --user %s --password %s --url %s', dir, user, password, url);
const cmd = util.format('mocha %s', args);
shell.exec(cmd);
