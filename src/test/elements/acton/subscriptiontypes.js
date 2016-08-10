'use strict';

const suite = require('core/suite');
const payload = require('./assets/subscriptiontypes');

suite.forElement('marketing', 'subscription-types', { payload: payload }, (test) => {
  test.should.return200OnGet();
});
