'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const subscriptionsPayload = tools.requirePayload(`${__dirname}/assets/subscriptions.json`);
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);

suite.forElement('payment', 'polling', null, (test) => {
  test.withApi('/hubs/payment/subscriptions').should.supportPolling(subscriptionsPayload, 'subscriptions');
  test.withApi('/hubs/payment/customers').should.supportPolling(customersPayload, 'customers');
});
