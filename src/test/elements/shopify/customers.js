'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const schema = require('./assets/customers.schema');

const customer = (custom) => new Object({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

suite.forElement('ecommerce', 'customers', customer({}), schema, (test) => {
  test.should.supportCruds();
});
