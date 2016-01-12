'use strict';

const path = require('path');
const fs = require('fs');
const commander = require('commander');
const util = require('util');
const shell = require('shelljs');
const config = require(process.env.HOME + '/.churros/churros.json');

const collect = function collect(val, list) {
  list.push(val);
  return list;
}

const runTests = function runTests(resource, options) {
  const user = options.user || config.user;
  const password = options.password || config.password;
  const url = options.url || config.url;
  const suite = options.suite;
  const test = options.test;
  const mochaPaths = [];

  const rootTestDir = path.dirname(require.main.filename) + '/../test';

  // always pass the setup file first.  if it's an element, then use that element's setup file, otherwise use the default setup file
  if (resource.startsWith('elements')) {
    const setup = util.format('%s/%s/%s', rootTestDir, resource, 'setup');
    mochaPaths.push(setup);
  } else {
    const setup = util.format('%s/%s', rootTestDir, resource, 'setup');
    mochaPaths.push(rootTestDir + '/setup');
  }

  // validate the root resource path before continuing
  var testPath = util.format('%s/%s', rootTestDir, resource);
  if (!fs.existsSync(testPath)) {
    console.log('Invalid resource: %s', resource);
    process.exit(1);
  }

  // add the resource next, unless a specific suite was passed
  if (suite.length < 1) {
    mochaPaths.push(testPath);
  } else {
    suite.forEach((s) => {
      var suitePath = testPath + '/' + s;
      if (!fs.existsSync(suitePath + '.js')) {
        console.log('Invalid suite: %s', s);
        process.exit(1);
      }
      mochaPaths.push(suitePath);
    });
  }

  var args = util.format('--user %s --password %s --url %s --timeout 20000 --reporter spec --ui bdd', user, password, url);
  if (test) args += util.format(" --grep '%s'", test);

  var cmd = util.format('./node_modules/.bin/mocha %s %s', mochaPaths.join(' '), args);
  shell.exec(cmd);
}

commander
  .command('resource', 'The resource to test (formulas, notifications, elements/box, etc.)')
  .action((resource, options) => runTests(resource, options))
  .option('-s, --suite <suite>', 'The suite(s) of tests to run', collect, [])
  .option('-t, --test <test>', 'The specific test to run', '')
  .option('-u, --user <user>', '', '')
  .option('-p, --password <password>', '', '')
  .option('-r, --url <url>', '', '')
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ churros test formulas');
    console.log('    $ churros test formulas --suite formulas.instances --suite formulas.triggers');
    console.log("    $ churros test formulas --suite formulas.instances --suite formulas.triggers --test 'file'");
    console.log('');
  })
  .parse(process.argv);
