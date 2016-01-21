'use strict';

const assert = require('assert');
const chakram = require('chakram');
const util = require('util');
const argv = require('optimist').demand('user').argv
const props = require('core/props');
const tv4 = require('tv4');

const customizeChakram = () => {
  chakram.addMethod("schemaAnd200", (r, schema) => {
    let responseStatus = r.response.statusCode;
    let responseBody = r.response.body;

    let composeErrorMessage = () => {
      let errorMsg = 'expected body to match JSON schema\n';
      if (tv4.error !== null) {
        errorMsg += util.format('error:%s\n', tv4.error.message);
        errorMsg += util.format('expected schema:\n%s\n', JSON.stringify(schema, null, 2));
        errorMsg += util.format('response body:\n%s\n', JSON.stringify(responseBody, null, 2));
      }
      return errorMsg;
    };

    let is200 = responseStatus == 200;
    let message = util.format('expected %s to be 200.  response body was \n%s', responseStatus, JSON.stringify(responseBody, null, 2));
    assert(is200, message);

    let valid = tv4.validate(r.response.body, schema);
    assert(
      valid,
      composeErrorMessage(),
      'expected body to not match JSON schema ' + JSON.stringify(schema)
    );
  });
};

before((done) => {
  customizeChakram();

  const user = argv.user;
  const password = argv.password;
  const url = argv.url;

  // override properties here on initialization
  props.set('user', user);
  props.set('password', password);
  props.set('url', url);

  const secUrl = url + '/elements/j_spring_security_check';
  const form = {
    j_username: user,
    j_password: password
  };

  chakram.post(secUrl, null, {
      jar: true,
      form: form
    })
    .then(r => {
      return chakram.get(url + '/elements/api-v1/ui/getSecrets', {
        jar: true
      });
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
