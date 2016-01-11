'use strict';

const chakram = require('chakram');
const util = require('util');
const argv = require('optimist').demand('user').argv

before((done) => {
  const user = argv.user;
  const password = argv.password;
  const url = argv.url;

  const secUrl = url + '/elements/j_spring_security_check';
  const form = { j_username: user, j_password: password };

  chakram.post(secUrl, null, { jar: true, form: form })
    .then((r) => {
      return chakram.get(url + '/elements/api-v1/ui/getSecrets', { jar: true });
    })
    .then((r) => {
      chakram.setRequestDefaults({
        baseUrl: url + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s', r.body.user, r.body.company)
        }
      });
      done();
    })
    .catch((r) => {
      console.log('Failed to get user secret: ' + r);
      done();
    });
});
