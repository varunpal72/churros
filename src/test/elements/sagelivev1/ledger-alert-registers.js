'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/ledger-alert-registers.json`);
const pre1Payload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/ledger-alerts.json`);

suite.forElement('finance', 'ledger-alert-registers', { payload: payload }, (test) => {
  let id,id1;
  before(() =>cloud.post(`/hubs/finance/ledger-alerts`, prePayload)
      .then(r => {
        id = r.body.id;
        payload.LedgerAlert = id;
      })
      .then(r => cloud.post(`/hubs/finance/dimensions`, pre1Payload))
      .then(r => {
        id1 = r.body.id;
        payload.Dimension = id1;
      })
      .then(r => cloud.get(`/hubs/finance/ledger-accounts`))
      .then(r => payload.LedgerAccount = r.body[0].id));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() =>  cloud.delete(`/hubs/finance/ledger-alerts/${id}`)
      .then(r => cloud.delete(`/hubs/finance/dimensions/${id1}`)));
});
