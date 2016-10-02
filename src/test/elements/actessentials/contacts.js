'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');

suite.forElement('marketing', 'contacts', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite
  test.should.supportCruds();
  // it('lukevance should insert some tests here :)', () => true);
});
