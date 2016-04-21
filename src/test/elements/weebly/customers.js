'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('ecommerce', 'customers', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('calebgeene should insert some tests here :)', () => true);
});
