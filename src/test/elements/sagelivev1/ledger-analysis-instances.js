'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const ledgerAnalysesInstancePayload = require('./assets/ledger-analysis-instances');
const prePayload = tools.requirePayload(`${__dirname}/assets/ledger-analyses.json`);
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);

suite.forElement('finance', 'ledger-analysis-instances', { payload: ledgerAnalysesInstancePayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/ledger-analyses`, prePayload)
      .then(r =>{
        ledgerAnalysesInstancePayload.LedgerAnalysis = r.body.id;
       id =  r.body.id ;
      })
      .then(r =>cloud.get(`/hubs/finance/companies`))
      .then(r => ledgerAnalysesInstancePayload.Company = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/currencies`))
      .then(r => ledgerAnalysesInstancePayload.Currency = r.body[0].id));
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
