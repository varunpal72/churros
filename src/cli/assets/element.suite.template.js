'use strict';

const tester = require('core/tester');
const schema = require('./assets/%resource.schema');

tester.for('%hub', '%resource', schema, (api) => {
  // checkout functions available under tester.it which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('%user should insert some tests here :)', () => true);
});
