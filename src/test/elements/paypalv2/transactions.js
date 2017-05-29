'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/sales');
const expect = require('chakram').expect;

suite.forElement('payment', 'transactions', { payload: payload }, (test) => {
  it(`should allow R for ${test.api}, C for ${test.api}/:id/refund, and R for /refunds`, () => {
    let id, refundId;
    let refundPayload = {
      "amount": {
        "currency": "USD",
        "total": "5.00"
      }
    };
    return cloud.post('/payments', payload)
      .then(r => {
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].sale).to.not.be.empty;
        id = r.body.transactions[0].related_resources[0].sale.id;
      })
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.post(`${test.api}/${id}/refund`, refundPayload))
      .then(r => refundId = r.body.id)
      .then(r => cloud.get(`/refunds/${refundId}`))
      .then(r => expect(r.body).to.not.be.empty);
  });
});