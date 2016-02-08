'use strict';

require('core/assertions');
const chakram = require('chakram');
const expect = chakram.expect;
const argv = require('optimist').argv;
const defaults = require('core/defaults');
const logger = require('core/logger')(argv.verbose ? 'silly' : 'info');

let config;
try {
  config = require(process.env.HOME + '/.churros/sauce.json');
} catch (e) {
  console.log('No properties found.  Make sure to run \'churros init\' first.');
  process.exit(1);
}

config.user = (argv.user || config.user);
config.password = (argv.password || config.password);
config.url = (argv.url || config.url);
config.browser = (argv.browser || 'phantomjs');

if (!config.events) config.events = {};
config.events.wait = (argv.wait || config.events.wait);
config.events.load = (argv.load || config.events.load);
config.events.element = (argv.loadElement || config.events.element);

// this happens once
const props = require('core/props')(config);

before((done) => {
  const url = props.get('url');
  const secUrl = url + '/elements/j_spring_security_check';
  const options = { jar: true, form: { j_username: props.get('user'), j_password: props.get('password') } };

  return chakram.post(secUrl, null, options)
    .then(r => {
      const secretOptions = { jar: true };
      expect(r).to.have.statusCode(200);
      return chakram.get(url + '/elements/api-v1/ui/getSecrets', secretOptions);
    })
    .then(r => {
      expect(r).to.have.statusCode(200);
      defaults(url + '/elements/api-v2', r.body.user, r.body.company);
      done();
    })
    .catch(r => {
      // if the lifecycle fails, then we want to exit with an error and not let anything else continue
      logger.error('Well shucks...failed to finish initialization...\n  Is %s up and running?\n  Do you have the right username and password?\n', url);
      logger.error(r);
      process.exit(1);
    });
});
