'use strict';

const suite = require('core/suite');
const payload = require('./assets/%name');
const schema = require('./assets/%name.schema');

suite.forPlatform('%name', { schema: schema, payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('%user should insert some tests here :)', () => true);
});
