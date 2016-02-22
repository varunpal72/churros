'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const customer = (custom) => new Object({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

suite.forElement('ecommerce', 'customers', customer({}), (test) => {
  test.should.supportCruds();
});
