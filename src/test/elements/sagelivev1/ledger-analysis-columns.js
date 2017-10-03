'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const ledgerAnalysesColumnsPayload = require('./assets/ledger-analysis-columns');
const prePayload = tools.requirePayload(`${__dirname}/assets/ledger-analyses.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'ledger-analysis-columns', { payload: ledgerAnalysesColumnsPayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/ledger-analyses`, prePayload)
    .then(r => {
      ledgerAnalysesColumnsPayload.LedgerAnalysis = r.body.id;
      id = r.body.id;
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
  after(() => cloud.delete(`/hubs/finance/ledger-analyses/${id}`));
});
