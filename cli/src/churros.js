'use strict';

const program = require('commander');
const colors = require('colors');

program
  .version('0.0.1')
  .option('-s, --suite [suite]', 'The name of the suite to run', '')
  .option('-e, --env [env]', 'The environment to run the tests against', /^(local|snapshot|qa|staging|prod)$/i, 'local')
  .option('-u, --user [user]', 'The soba user to run the tests as', 'system')
  .option('-p, --password [password]', 'The password for this user', 'system')
  .parse(process.argv);

if (!program.suite || !program.env) {
  program.outputHelp((txt) => {
    return colors.red(txt);
  });
  process.exit(1);
}

// TODO - JJW - build process should set this up a little nicer...need some guidance from rocky and t-mac on best approach
process.env.CHURROS_ENVIRONMENT = program.env;
process.env.CHURROS_USERNAME = program.user;
process.env.CHURROS_PASSWORD = program.password;
process.env.CHURROS_SUITE = program.suite;

// TODO - JJW - hacky as all get out...
require('../../test/lifecycle');
require('../../test/' + program.suite + '/all');
