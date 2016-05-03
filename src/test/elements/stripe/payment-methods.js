'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const cloud = require('core/cloud');
const customer = require('./assets/customers');
const paymentMethod = require('./assets/payment-methods');

const updatePaymentMethod = () => ({
  "name": tools.random()
});

suite.forElement('payment', 'payment-methods', (test) => {
  let customerId;
  before(() => cloud.post(`/hubs/payment/customers`,customer)
    .then(r => customerId = r.body.id)
  );
  it(`should allow GET for /hubs/payment/customers/{customerId}/payment-methods`, () => {
    return cloud.get(`/hubs/payment/customers/${customerId}/payment-methods`);
  });
  it(`should allow CRUD for /hubs/payment/customers/{customerId}/payment-methods/{paymentId}`, () => {
    let paymentId;
    return cloud.post(`/hubs/payment/customers/${customerId}/payment-methods`, paymentMethod)
      .then(r => paymentId = r.body.id)
      .then(r => cloud.get(`/hubs/payment/customers/${customerId}/payment-methods/${paymentId}`))
      .then(r => cloud.patch(`/hubs/payment/customers/${customerId}/payment-methods/${paymentId}`, updatePaymentMethod()))
      .then(r => cloud.delete(`/hubs/payment/customers/${customerId}/payment-methods/${paymentId}`));
  });
  after(() => cloud.delete(`/hubs/payment/customers/${customerId}`));
});
