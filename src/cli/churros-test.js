'use strict';

const path = require('path');
const fs = require('fs');
const commander = require('commander');
const util = require('util');
const shell = require('shelljs');

const collect = (val, list) => {
  list.push(val);
  return list;
};

const parse = (options, config) => {
  let url = options.url || config.url;
  if (url.startsWith('localhost')) url = 'http://' + url;
  if (!url.startsWith('http')) url = 'https://' + url;
  options.verbose = options.verbose === undefined ? false : options.verbose; // hack...i can't figure out why it's not default to false

  return {
    url: url,
    user: options.user || config.user,
    password: options.password || config.password,
    wait: options.wait || config.events.wait,
    load: options.load || config.events.load,
    loadElement: options.element || config.events.element,
    verbose: options.verbose
  };
};

const runTests = (suite, options) => {
  let config;
  try {
    config = require(process.env.HOME + '/.churros/sauce.json');
  } catch (e) {
    console.log('No properties found.  Make sure to run \'churros init\' first.');
    process.exit(1);
  }

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

  let args = util.format('--user %s --password %s --url %s --verbose %s --timeout 600000 --reporter spec --ui bdd', cliArgs.user, cliArgs.password, cliArgs.url, cliArgs.verbose);
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
  .option('-V, --verbose', 'logging verbose mode')
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    # Element Tests');
    console.log('    $ churros test elements/closeio');
    console.log('    $ churros test elements/closeio --test \'contacts\'');
    console.log('');
    console.log('    # Platform Tests');
    console.log('    $ churros test platform/notifications');
    console.log('    $ churros test platform/formulas');
    console.log('    $ churros test platform/formulas --test \'should not allow\'');
    console.log('    $ churros test platform/events --element sfdc');
    console.log('    $ churros test platform/events --element sfdc --load 50 --wait 60');
    console.log('');
  })
  .parse(process.argv);
