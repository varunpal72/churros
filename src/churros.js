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
