'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
});
