'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);

suite.forElement('ecommerce', 'polling', null, (test) => {
  test.withApi('/hubs/ecommerce/products').should.supportPolling(productsPayload, 'products');
  test.withApi('/hubs/ecommerce/customers').should.supportPolling(customersPayload, 'customers');
});
