'use strict';

const tester = require('core/tester');
const tools = require('core/tools');
const schema = require('./assets/customers.schema');

const customer = (custom) => new Object({
  firstName: custom.firstName || 'Bill',
  lastName: custom.lastName || 'Murray',
  email: custom.email || tools.randomEmail()
});

tester.for('ecommerce', 'customers', (api) => {
  tester.test.cruds(api, customer({}), schema);
});
