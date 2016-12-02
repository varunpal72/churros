'use strict';

const suite = require('core/suite');
const payload = require('./assets/contacts');
const tools = require('core/tools');
payload.email = tools.randomEmail();

suite.forElement('helpdesk', 'contacts', { payload: payload, skip: true }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite


  test.should.supportCruds();
});
