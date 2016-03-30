'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
// const payload = require('./assets/customers');

const customer = (custom) => ({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail(),
  password: tools.random()
});

suite.forElement('ecommerce', 'customers', { payload: customer({}) }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
