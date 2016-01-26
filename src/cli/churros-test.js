'use strict';

const path = require('path');
const fs = require('fs');
const commander = require('commander');
const util = require('util');
const shell = require('shelljs');

const collect = function collect(val, list) {
  list.push(val);
  return list;
};

const parse = (options, config) => {
  let url = options.url || config.url;
  if (url.startsWith('localhost')) url = 'http://' + url;
  if (!url.startsWith('http')) url = 'https://' + url;

  return {
    url: url,
    user: options.user || config.user,
    password: options.password || config.password,
    wait: options.wait || config.events.wait,
    load: options.load || config.events.load,
    loadElement: options.element || config.events.element
  };
};

const runTests = function runTests(suite, options) {
  const config = require(process.env.HOME + '/.churros/sauce.json');

  const file = options.file;
  const test = options.test;
  const cliArgs = parse(options, config);

  // ugly as all get out ...
  const rootDir = path.dirname(require.main.filename);
  const rootTestDir = rootDir + '/../test';

  // always pass the lifecycle file first.  if it's an element, then use that element's lifecycle file too
  const mochaPaths = [];
  mochaPaths.push(rootTestDir + '/lifecycle');

  let element = null;
  if (suite.startsWith('elements') || suite.startsWith('element')) {
    const elementSetup = util.format('%s/%s/%s', rootTestDir, 'elements', 'lifecycle');
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
  if (file.length < 1) mochaPaths.push(testPath);
  else {
    file.forEach((s) => {
      let filePath = testPath + '/' + s;
      if (!fs.existsSync(filePath + '.js')) {
        console.log('Invalid file: %s', s);
        process.exit(1);
      }
      mochaPaths.push(filePath);
    });
  }

  let args = util.format('--user %s --password %s --url %s --timeout 600000 --reporter spec --ui bdd', cliArgs.user, cliArgs.password, cliArgs.url);
  if (test) args += util.format(" --grep '%s'", test);
  if (element) args += util.format(" --element %s", element);
  if (cliArgs.load) args += util.format(" --load %s", cliArgs.load);
  if (cliArgs.wait) args += util.format(" --wait %s", cliArgs.wait);
  if (cliArgs.loadElement) args += util.format(" --loadElement %s", cliArgs.loadElement);

  let cmd = util.format(rootDir + '/../../node_modules/.bin/mocha %s %s', mochaPaths.join(' '), args);
  shell.exec(cmd);
};

commander
  .command('suite', 'suite to test')
  .action((suite, options) => runTests(suite, options))
  .option('-s, --file <file>', 'file(s) of tests to run (exclude the .js)', collect, [])
  .option('-t, --test <test>', 'specific test(s) to run.  This searches through all "describe(...)" and "it(...)" strings', '')
  .option('-e, --element <element>', 'element to use while running this specific suite (only available for "churros test events")', '')
  .option('-l, --load <#>', 'specifies the specific load to test with (only available for "churros test events")', '')
  .option('-w, --wait <#>', 'how long to wait for tests to complete (only available for "churros test events")', '')
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
    console.log('    $ churros test notifications');
    console.log('');
    console.log('    $ churros test elements/closeio');
    console.log('');
    console.log('    $ churros test events --for sfdc --load 50');
    console.log('    $ churros test events --for sfdc --load 50 --wait 30000');
    console.log('');
  })
  .parse(process.argv);
