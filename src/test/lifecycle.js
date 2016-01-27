'use strict';

const assert = require('assert');
const chakram = require('chakram');
const util = require('util');
const argv = require('optimist').demand('user').argv;
const props = require('core/props');
const tv4 = require('tv4');

const customizeChakram = () => {
  chakram.addMethod('statusCode', (r, status) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    assert(
      responseStatus === status,
      'expected status code ' + responseStatus + ' to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2),
      'expected status code ' + responseStatus + ' not to equal ' + status + '\nresponse body:\n' + JSON.stringify(responseBody, null, 2)
    );
  });

  chakram.addMethod("schemaAnd200", (r, schema) => {
    const responseStatus = r.response.statusCode;
    const responseBody = r.response.body;

    const composeErrorMessage = () => {
      let errorMsg = 'expected body to match JSON schema\n';
      if (tv4.error !== null) {
        errorMsg += util.format('error:%s\n', tv4.error.message);
        errorMsg += util.format('expected schema:\n%s\n', JSON.stringify(schema, null, 2));
        errorMsg += util.format('response body:\n%s\n', JSON.stringify(responseBody, null, 2));
      }
      return errorMsg;
    };

    const is200 = responseStatus === 200;
    const message = util.format('expected %s to be 200.  response body was \n%s', responseStatus, JSON.stringify(responseBody, null, 2));
    assert(is200, message);

    const valid = tv4.validate(r.response.body, schema);
    assert(
      valid,
      composeErrorMessage(),
      'expected body to not match JSON schema ' + JSON.stringify(schema)
    );
  });
};

const setGlobalProps = (args) => {
  props.set('user', args.user);
  props.set('password', args.password);
  props.set('url', args.url);
  props.setForKey('events', 'wait', args.wait);
  props.setForKey('events', 'load', args.load);
  props.setForKey('events', 'element', args.loadElement);
};

const init = (args) => {
  customizeChakram();
  setGlobalProps(argv);
};

before((done) => {
  init(argv);

  const secUrl = props.get('url') + '/elements/j_spring_security_check';
  const form = {
    j_username: props.get('user'),
    j_password: props.get('password')
  };

  const options = {
    jar: true,
    form: form
  };

  const secretOptions = {
    jar: true
  };

  chakram.post(secUrl, null, options)
    .then(r => chakram.get(props.get('url') + '/elements/api-v1/ui/getSecrets', secretOptions))
    .then(r => {
      props.set('user.secret', r.body.user);
      props.set('org.secret', r.body.company);
      chakram.setRequestDefaults({
        baseUrl: props.get('url') + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s', r.body.user, r.body.company)
        }
      });
      done();
    })
    .catch(r => {
      console.log('Well shucks...failed to finish initialization...\n  Is %s up and running?\n  Do you have the write username and password?', props.get('url'));
      process.exit(1);
    });
});
