'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/ledger-items.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/ledger-entries.json`);

suite.forElement('finance', 'ledger-items', { payload: payload, skip: true }, (test) => { //Only Accounts or Subaccounts can be posted to directly
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => prePayload.Company = r.body.id)
    .then(r => cloud.post(`/hubs/finance/ledger-entries`, prePayload))
    .then(r => {
      id = r.body.id;
      payload.LedgerEntry = id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/ledger-entries/${id}`));
});
