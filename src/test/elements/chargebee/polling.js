'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const plansPayload = tools.requirePayload(`${__dirname}/assets/plans.json`);
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);

suite.forElement('payment', 'polling', null, (test) => {
  test.withApi('/hubs/payment/plans').should.supportPolling(plansPayload, 'events');
  test.withApi('/hubs/payment/customers').should.supportPolling(customersPayload, 'events');
});
