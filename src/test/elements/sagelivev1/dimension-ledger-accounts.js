'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const dimensionLedgerAccountsPayload = tools.requirePayload(`${__dirname}/assets/dimension-ledger-accounts.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'dimension-ledger-accounts', { payload: dimensionLedgerAccountsPayload }, (test) => {
let id;
const options = {
  churros: {
    updatePayload: update
  }
};
before(() => cloud.get(`/hubs/finance/ledger-accounts`)
  .then(r => dimensionLedgerAccountsPayload.LedgerAccount = r.body[0].id)
  .then(r => cloud.post(`/hubs/finance/dimensions`, prePayload))
  .then(r => {
    id = r.body.id;
    dimensionLedgerAccountsPayload.Dimension = id;
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
after(() => cloud.delete(`/hubs/finance/dimensions/${id}`));
});
