'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
payload.name = tools.random();
payload.domains = [tools.random(), tools.random()];

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {
  // checkout functions available under test.should which provide a lot of pre-canned tests
  //   more information here: https://github.com/cloud-elements/churros/blob/master/CONTRIBUTING.md#adding-tests-to-an-existing-suite


  test.should.supportCruds();
});
