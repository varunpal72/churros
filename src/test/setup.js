'use strict';

const chakram = require('chakram');
const util = require('util');
const argv = require('optimist').demand('user').argv
const props = require('core/props');

before((done) => {
  const user = argv.user;
  const password = argv.password;
  const url = argv.url;

  // override properties here on initialization
  props.set('user', user);
  props.set('password', password);
  props.set('url', url);

  const secUrl = url + '/elements/j_spring_security_check';
  const form = { j_username: user, j_password: password };

  chakram.post(secUrl, null, { jar: true, form: form })
    .then(r => {
      return chakram.get(url + '/elements/api-v1/ui/getSecrets', { jar: true });
    })
    .then(r => {
      props.set('user.secret', r.body.user);
      props.set('org.secret', r.body.company);
      chakram.setRequestDefaults({
        baseUrl: url + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s', r.body.user, r.body.company)
        }
      });
      done();
    })
    .catch(r => {
      console.log('Well shucks...failed to finish setup...\n  Is %s up and running?\n  Do you have the write username and password?', url);
      process.exit(1);
    });
});
