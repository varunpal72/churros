'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/ledger-analysis-items.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets//ledger-analysis-instances.json`);

suite.forElement('finance', 'ledger-analysis-items', { payload: payload }, (test) => {
  let id;
  before(() => cloud.post(`/hubs/finance/ledger-analysis-instances`, prePayload)
    .then(r => {
      payload.LedgerAnalysisInstance = r.body.id;
      id = r.body.id;
    }));
  test.should.supportCrds(); //Update not possible: Created items cannot be changed
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() => cloud.delete(`/hubs/finance/ledger-analysis-instances/${id}`));
});
