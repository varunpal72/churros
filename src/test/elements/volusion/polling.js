'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);

//Getting lots of chatter on the callback. Seems to have many users on our creds
suite.forElement('finance', 'polling', {skip: true}, (test) => {
  test.withApi('/hubs/finance/customers').should.supportPolling(customersPayload, 'customers');
  test.withApi('/hubs/finance/products').should.supportPolling(productsPayload, 'products');
});
