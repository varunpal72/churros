'use strict';

const chakram = require('chakram');
const util = require('util');

const environments = {
  'localhost': 'http://localhost:8080',
  'local': 'http://localhost:8080',
  'snapshot': 'https://snapshot.cloud-elements.com',
  'qa': 'https://qa.cloud-elements.com',
  'staging': 'https://staging.cloud-elements.com',
  'prod': 'https://api.cloud-elements.com'
};

before((done) => {
  const baseUrl = environments[process.env.CHURROS_ENVIRONMENT];
  const url = baseUrl + '/elements/j_spring_security_check';
  const form = {j_username: process.env.CHURROS_USERNAME, j_password: process.env.CHURROS_PASSWORD};

  chakram.post(url, form, {form: form})
    .then(r => {
      console.log('Attempting to get user and organization secrets');
      chakram.get(baseUrl + '/elements/api-v1/ui/getSecrets')
    })
    .then(r => {
      const creds = r.body;

      chakram.setRequestDefaults({
        baseUrl: baseUrl + '/elements/api-v2',
        headers: {
          Authorization: util.format('User %s, Organization %s', creds.userSecret, creds.orgSecret)
        }
      });
    })
    .then(done)
    .catch(r => {
      console.log('Error while running tests: ' + r);
      done();
    });
});
