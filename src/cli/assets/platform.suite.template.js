'use strict';

const tester = require('core/tester');
const payload = require('./assets/%name');
const schema = require('./assets/%name.schema');

tester.forPlatform('%name', schema, payload, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('%user should insert some tests here :)', () => true);
});
