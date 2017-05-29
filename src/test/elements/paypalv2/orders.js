'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/orders.json`);
const payloadToAuthorize = tools.requirePayload(`${__dirname}/assets/orders.json`);
const expect = require('chakram').expect;

suite.forElement('payment', 'orders', { payload: payload }, (test) => {
  it(`should allow CRD for ${test.api}`, () => {
    let id;
    return cloud.post('/payments', payload)
      .then(r => {
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].order).to.not.be.empty;
        id = r.body.transactions[0].related_resources[0].order.id;
      })
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
  it(`should allow U for ${test.api}/:id/authorize and C for ${test.api}/:id/capture`, () => {
    let id;
    let nestedPayload = {
      "amount": {
        "currency": "USD",
        "total": "5.00"
      }
    };
    return cloud.post('/payments', payloadToAuthorize)
      .then(r => {
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].order).to.not.be.empty;
        id = r.body.transactions[0].related_resources[0].order.id;
      })
      .then(r => cloud.patch(`${test.api}/${id}/authorize`, nestedPayload))
      .then(r => cloud.post(`${test.api}/${id}/capture`, nestedPayload));
  });
});
