'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/customers.schema');

const customer = (custom) => new Object({
  first_name: custom.firstName || 'Bill',
  last_name: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

tester.for('ecommerce', 'customers', schema, (api) => {
  tester.it.shouldSupportCruds(customer({}));
});
