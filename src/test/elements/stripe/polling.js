'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const plansPayload = tools.requirePayload(`${__dirname}/assets/plans.json`);
const productsPayload = tools.requirePayload(`${__dirname}/assets/products.json`);

suite.forElement('payment', 'polling', null, (test) => {
  test.withApi('/hubs/payment/customers').should.supportPolling(customersPayload, 'events');
  test.withApi('/hubs/payment/plans').should.supportPolling(plansPayload, 'events');
  test.withApi('/hubs/payment/products').should.supportPolling(productsPayload, 'events');
});
