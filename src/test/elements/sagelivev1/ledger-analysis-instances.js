'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload= require('./assets/ledger-analysis-instances');
const build = (overrides) => Object.assign({}, payload, overrides);
const ledgerAnalysesInstancePayload = build({Name: "name" + tools.randomInt()});

suite.forElement('finance', 'ledger-analysis-instances',{ payload:ledgerAnalysesInstancePayload } , (test) => {
  let name;
  it('should support GET  Company and Currency', () => {
      cloud.get(`/hubs/finance/companies`)
        .then(r => ledgerAnalysesInstancePayload.Company = r.body[0].id)
        .then(r =>  cloud.get(`/hubs/finance/currencies`))
        .then(r => ledgerAnalysesInstancePayload.Currency = r.body[0].id)
        .then(r =>  cloud.get(`/hubs/finance/ledger-analyses`))
        .then(r => ledgerAnalysesInstancePayload.LedgerAnalysis = r.body[0].id)
        .then(r =>  cloud.get(`/hubs/finance/dimensions`))
        .then(r => ledgerAnalysesInstancePayload.Dimension = r.body[0].id);
    });
    test.should.supportCruds();
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
          return cloud.get(test.api)
            .then(r => name = r.body[0].Name);
      });
    test
     .withName(`should support searching ${test.api} by Name`)
     .withOptions({ qs: { where:`Name  ='${name}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Name === `${name}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
