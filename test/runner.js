var program = require('commander');
var colors = require('colors');
var base = require('./base');

var environments = {
  'localhost': 'http://localhost:8080',
  'local': 'http://localhost:8080',
  'snapshot': 'https://snapshot.cloud-elements.com',
  'qa': 'https://qa.cloud-elements.com',
  'staging': 'https://staging.cloud-elements.com',
  'prod': 'https://api.cloud-elements.com'
};

program
  .version('0.0.1')
  .option('-s, --suite [suite]', 'The name of the suite to run', '')
  .option('-e, --env [env]', 'The environment to run the tests against', /^(local|snapshot|qa|staging|prod)$/i, 'local')
  .option('-u, --user [user]', 'The soba user to run the tests as', 'system')
  .option('-p, --password [password]', 'The password for this user', 'system')
  .parse(process.argv);

if (!program.suite || !program.env) {
  program.outputHelp(function (txt) {
    return colors.red(txt);
  });
  process.exit(1);
}

base.start(program.suite, environments[program.env], program.user, program.password);
