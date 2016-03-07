'use strict';

const path = require('path');
const fs = require('fs');
const commander = require('commander');
const util = require('util');
const shell = require('shelljs');
const prompter = require('./assets/prompter');

const collect = (val, list) => {
  list.push(val);
  return list;
};

const validateValue = (value) => value ? true : 'Must enter a value';

const fromOptions = (url, options) => {
  return new Promise((res, rej) => {
    res({
      url: url,
      user: options.user,
      password: options.password,
      wait: options.wait,
      load: options.load,
      loadElement: options.element,
      browser: options.browser,
      verbose: options.verbose === undefined ? false : options.verbose // hack...i can't figure out why it's not default to false
    });
  });
};

const parse = (options) => {
  let url = options.url;
  if (url && url.startsWith('localhost')) url = 'http://' + url;
  if (url && !url.startsWith('http')) url = 'https://' + url;

  // if the user passed the --password flag, then prompt them for their password before continuing
  if (options.password) {
    const qs = [prompter.buildQuestion('password', 'password', 'Enter password:', (value) => validateValue(value))];
    return prompter.askQuestions(qs)
      .then(r => options.password = r.password)
      .then(r => fromOptions(url, options));
  }
  return fromOptions(url, options);
};

const run = (suite, options, cliArgs) => {
  const file = options.file;
  const test = options.test;

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

  let args = util.format('--timeout 600000 --reporter spec --ui bdd');
  if (test) args += util.format(" --grep '%s'", test);
  if (element) args += util.format(" --element %s", element);
  if (cliArgs.url) args += util.format(" --url %s", cliArgs.url);
  if (cliArgs.user) args += util.format(" --user %s", cliArgs.user);
  if (cliArgs.password) args += util.format(" --password %s", cliArgs.password);
  if (cliArgs.load) args += util.format(" --load %s", cliArgs.load);
  if (cliArgs.wait) args += util.format(" --wait %s", cliArgs.wait);
  if (cliArgs.loadElement) args += util.format(" --loadElement %s", cliArgs.loadElement);
  if (cliArgs.verbose) args += util.format(" --verbose %s", cliArgs.verbose);
  if (cliArgs.browser) args += util.format(" --browser %s", cliArgs.browser);

  let cmd = util.format(rootDir + '/../../node_modules/.bin/mocha %s %s', mochaPaths.join(' '), args);
  process.exit(shell.exec(cmd).code); // execute the cmd and make our exit code the same as 'churros test' code
};

const runTests = (suite, options) => {
  return parse(options)
    .then(cliArgs => run(suite, options, cliArgs))
    .catch(r => {
      console.log('Failed to run tests: ', r);
      process.exit(1);
    });
};

commander
  .command('suite', 'suite to test')
  .action((suite, options) => runTests(suite, options))
  .option('-s, --file <file>', 'file(s) of tests to run (exclude the .js)', collect, [])
  .option('-t, --test <test>', 'specific test(s) to run.  This searches through all "describe(...)" and "it(...)" strings')
  .option('-e, --element <element>', 'element to use while running this specific suite (only available for "churros test events")')
  .option('-l, --load <#>', 'specifies the specific load to test with (only available for "churros test events")')
  .option('-w, --wait <#>', 'how long to wait for tests to complete (only available for "churros test events")')
  .option('-r, --url [url]', 'overrides the default URL setup during initialization')
  .option('-u, --user <user>', 'overrides the default user setup during initialization')
  .option('-p, --password', 'overrides the default password setup during initialization (this will prompt you for your password)')
  .option('-b, --browser <name>', 'browser to use during the selenium OAuth process', 'firefox') // will change this to phantomjs as churros becomes more mature
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
