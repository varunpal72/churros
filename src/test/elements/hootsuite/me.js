'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('social', 'me', (test) => {
  it(`should allow GET for ${test.api}`, () => {
    return cloud.get(`${test.api}`)
      .then(r => cloud.get(`${test.api}/organizations`))
      .then(r => cloud.get(`${test.api}/social-profiles`));
  });
});
