'use strict';

const tester = require('core/tester');
const payload = require('./assets/%resource');
const schema = require('./assets/%resource.schema');

tester.forElement('%hub', '%resource', payload, schema, (suite) => {
  // checkout functions available under suite.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('%user should insert some tests here :)', () => true);
});
