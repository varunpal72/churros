'use strict';

const path = require('path');
const fs = require('fs');
const commander = require('commander');
const util = require('util');
const shell = require('shelljs');

const collect = function collect(val, list) {
  list.push(val);
  return list;
}

const runTests = function runTests(suite, options) {
  const config = require(process.env.HOME + '/.churros/sauce.json');
  const file = options.file;
  const test = options.test;
  const user = options.user || config.user;
  const password = options.password || config.password;
  let url = options.url || config.url;

  if (url.startsWith('localhost')) url = 'http://' + url;
  if (!url.startsWith('http')) url = 'https://' + url;

  const rootDir = path.dirname(require.main.filename); // ugly as all get out ...
  const rootTestDir = rootDir + '/../test';

  // always pass the setup file first.  if it's an element, then use that element's setup file too
  const mochaPaths = [];
  mochaPaths.push(rootTestDir + '/setup');

  let element = null;
  if (suite.startsWith('elements')) {
    const elementSetup = util.format('%s/%s/%s', rootTestDir, 'elements', 'setup');
    element = suite.split('/')[1]; // i.e 'elements/box' would get 'box' here
    mochaPaths.push(elementSetup);
  }

  // validate the root suite path before continuing
  let testPath = util.format('%s/%s', rootTestDir, suite);
  if (!fs.existsSync(testPath)) {
    console.log('Invalid suite: %s', suite);
    process.exit(1);
  }

  // add the suite next, unless a specific file was passed
  if (file.length < 1) {
    mochaPaths.push(testPath);
  } else {
    file.forEach((s) => {
      let filePath = testPath + '/' + s;
      if (!fs.existsSync(filePath + '.js')) {
        console.log('Invalid file: %s', s);
        process.exit(1);
      }
      mochaPaths.push(filePath);
    });
  }

  // 10 minute timeout right now
  let args = util.format('--user %s --password %s --url %s --timeout 600000 --reporter spec --ui bdd', user, password, url);
  if (test) args += util.format(" --grep '%s'", test);
  if (element) args += util.format(" --element %s", element);

  let cmd = util.format(rootDir + '/../../node_modules/.bin/mocha %s %s', mochaPaths.join(' '), args);
  shell.exec(cmd);
}

commander
  .command('suite', 'suite to test (formulas, notifications, elements/box, etc.)')
  .action((suite, options) => runTests(suite, options))
  .option('-s, --file <file>', 'file(s) of tests to run (exclude the .js)', collect, [])
  .option('-t, --test <test>', 'specific test(s) to run.  This searches through all "describe(...)" and "it(...)" strings', '')
  .option('-u, --user <user>', 'overrides the default user setup during initialization', '')
  .option('-p, --password <password>', 'overrides the default password setup during initialization', '')
  .option('-r, --url <url>', 'overrides the default URL setup during initialization', '')
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
