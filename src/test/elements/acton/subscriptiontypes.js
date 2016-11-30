'use strict';

const suite = require('core/suite');
const payload = require('./assets/subscriptiontypes');

suite.forElement('marketing', 'subscription-types', { payload: payload, skip: true }, (test) => {
  test.should.return200OnGet();
});
