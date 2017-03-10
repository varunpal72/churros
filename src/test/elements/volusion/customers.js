'use strict';
const payload = require('./assets/customer.json');
const suite = require('core/suite');

suite.forElement('ecommerce', 'customers', { payload: payload}, (test) => {
  test.should.supportCrud();

});
