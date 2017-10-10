'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/ledger-balances.json`);

suite.forElement('finance', 'ledger-balances', { payload: payload }, (test) => {
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.Company = r.body[0].id)
    .then(r => cloud.get(`/hubs/finance/currencies`))
    .then(r => payload.Currency = r.body[0].id)
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
});
