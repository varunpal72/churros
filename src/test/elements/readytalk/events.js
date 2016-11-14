'use strict';

const suite = require('core/suite');
const payload = require('./assets/events');

suite.forElement('general', 'events', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite

  it('vagrant should insert some tests here :)', () => true);
});
