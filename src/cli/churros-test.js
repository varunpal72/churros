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

const runTests = function runTests(suite, options) {
  const file = options.file;
  const test = options.test;
  const user = options.user || config.user;
  const password = options.password || config.password;
  var url = options.url || config.url;

  if (url.startsWith('localhost')) url = 'http://' + url;
  if (!url.startsWith('http')) url = 'https://' + url;

  const rootTestDir = path.dirname(require.main.filename) + '/../test';

  // always pass the setup file first.  if it's an element, then use that element's setup file too
  const mochaPaths = [];
  const setup = util.format('%s/%s', rootTestDir, suite, 'setup');
  mochaPaths.push(rootTestDir + '/setup');

  if (suite.startsWith('elements')) {
    const elementSetup = util.format('%s/%s/%s', rootTestDir, suite, 'setup');
    mochaPaths.push(elementSetup);
  }

  // validate the root suite path before continuing
  var testPath = util.format('%s/%s', rootTestDir, suite);
  if (!fs.existsSync(testPath)) {
    console.log('Invalid suite: %s', suite);
    process.exit(1);
  }

  // add the suite next, unless a specific file was passed
  if (file.length < 1) {
    mochaPaths.push(testPath);
  } else {
    file.forEach((s) => {
      var filePath = testPath + '/' + s;
      if (!fs.existsSync(filePath + '.js')) {
        console.log('Invalid file: %s', s);
        process.exit(1);
      }
      mochaPaths.push(filePath);
    });
  }

  var args = util.format('--user %s --password %s --url %s --timeout 20000 --reporter spec --ui bdd', user, password, url);
  if (test) args += util.format(" --grep '%s'", test);

  var cmd = util.format('./node_modules/.bin/mocha %s %s', mochaPaths.join(' '), args);
  shell.exec(cmd);
}

commander
  .command('suite', 'The suite to test (formulas, notifications, elements/box, etc.)')
  .action((suite, options) => runTests(suite, options))
  .option('-s, --file <file>', 'The file(s) of tests to run (exclude the .js)', collect, [])
  .option('-t, --test <test>', 'The specific test(s) to run.  This searches through all "describe(...)" and "it(...)" strings', '')
  .option('-u, --user <user>', 'Overrides the default user setup during initialization', '')
  .option('-p, --password <password>', 'Overrides the default password setup during initialization', '')
  .option('-r, --url <url>', 'Overrides the default URL setup during initialization', '')
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    $ churros test formulas');
    console.log('    $ churros test formulas --file formulas.instances');
    console.log('    $ churros test formulas --file formulas.instances --file formulas.triggers');
    console.log('    $ churros test formulas --file formulas.instances --file formulas.triggers --test \'should not allow\'');
    console.log('');
  })
  .parse(process.argv);
