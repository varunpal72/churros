'use strict';

const suite = require('core/suite');
const payload = require('./assets/paymentMethod');
const customerPayload = require('./assets/customers');
const tools = require('core/tools');
const cloud=require('core/cloud');
const build = (overrides) => Object.assign({}, payload, overrides);
const paymentPayload = build({ CreditCardAddress1: tools.random()});
suite.forElement('payment', 'payment-methods', { payload: paymentPayload }, (test) => {
  test.should.supportPagination();
it(`should allow CRUDS ${test.api}`, () => {
 const updatePayload= {
        "CreditCardAddress1": tools.random()
      };
 let customerId,id;
 return cloud.post(`/hubs/payment/customers`, customerPayload)
      .then(r => customerId = r.body.id)
      .then(r => paymentPayload.AccountId=customerId)
      .then(r => cloud.post(`${test.api}`,paymentPayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r=>  cloud.put(`${test.api}/${id}`,updatePayload))
      .then(r=> cloud.delete(`${test.api}/${id}`))
      .then(r=> cloud.delete(`/hubs/payment/customers/${customerId}`));
});
});
