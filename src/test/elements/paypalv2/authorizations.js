'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('core/tools').requirePayload(`${__dirname}/assets/authorizations.json`);
const expect = require('chakram').expect;

suite.forElement('payment', 'authorizations', { payload: payload }, (test) => {
  it(`should allow CRD for ${test.api}`, () => {
    let id;
    return cloud.post('/payments', payload)
      .then(r => {
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].authorization).to.not.be.empty;
        id = r.body.transactions[0].related_resources[0].authorization.id;
      })
      .then(r => cloud.get(`${test.api}/${id}`))
      .then(r => cloud.delete(`${test.api}/${id}`));
  });
  it(`should allow U for ${test.api}/:id and C for ${test.api}/:id/capture`, () => {
    let id;
    let nestedPayload = {
      "amount": {
        "currency": "USD",
        "total": "5.00"
      }
    };
    return cloud.post('/payments', payload)
      .then(r => {
        expect(r.body.transactions).to.not.be.empty;
        expect(r.body.transactions[0].related_resources).to.not.be.empty;
        expect(r.body.transactions[0].related_resources[0].authorization).to.not.be.empty;
        id = r.body.transactions[0].related_resources[0].authorization.id;
      })
      // .then(r => cloud.patch(`${test.api}/${id}`, nestedPayload)) //cannot re-auth inside of honor period of creating a authorization payment (3 days)
      .then(r => cloud.post(`${test.api}/${id}/capture`, nestedPayload));
  });
});