'use strict';

const commander = require('commander');
const path = require('path');
const shell = require('shelljs');

const collect = (val, list) => {
  list.push(val);
  return list;
};

const terminate = (msg) => {
  console.error(msg);
  process.exit(1);
};

const clean = (resource, options) => {
  if (options.name.length < 1) terminate(`Please provide at least one name of a ${resource} to cleanup by using the --name option`);

  const rootDir = path.dirname(require.main.filename);
  const rootTestDir = rootDir + '/../test';

  // always pass the lifecycle file first.
  const mochaPaths = [];
  mochaPaths.push(rootTestDir + '/lifecycle');
  mochaPaths.push(rootTestDir + '/clean');

  // concat all names together
  let names = '';
  options.name.forEach(n => names += ` --name ${n}`);

  // build our args
  let args = `--timeout 600000 --reporter spec --ui bdd --resource ${resource} ${names}`;
  if (options.verbose) args += ` --verbose ${options.verbose}`;

  const cmd = `${rootDir}/../../node_modules/.bin/mocha ${mochaPaths.join(' ')} ${args}`;
  process.exit(shell.exec(cmd).code); // execute the cmd and make our exit code the same as 'churros test' code
};

commander
  .command('resource', 'platform resource to cleanup (formulas, elements)')
  .action((resource, options) => clean(resource, options))
  .option('-n, --name <name>', 'the resource name(s) to delete', collect, [])
  .option('-V, --verbose', 'logging verbose mode')
  .on('--help', () => {
    console.log('  Examples:');
    console.log('');
    console.log('    # Cleanup Formulas');
    console.log('    $ churros clean formulas --name my-formula-name');
    console.log('    $ churros clean formulas --name my-formula-name --name my-other-formula-name');
    console.log('');
    console.log('    # Cleanup Elements');
    console.log('    $ churros clean elements --name my-element-name');
    console.log('');
  })
  .parse(process.argv);
