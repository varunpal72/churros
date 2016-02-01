'use strict';

const tester = require('core/tester')();
const schema = require('./assets/%resource.schema');

tester.for('%hub', '%resource', () => {
  // checkout functions available under tester.test which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('%user should insert some tests here :)', () => true);
});
