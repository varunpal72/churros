'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const  ledgerAccountRulesPayload= require('./assets/ledger-account-rules');


suite.forElement('finance', 'ledger-account-rules',{ payload:ledgerAccountRulesPayload } , (test) => {
  let name;
  it('should support GET  LedgerAccount and Dimension', () => {
      cloud.get(`/hubs/finance/ledger-accounts`)
        .then(r => ledgerAccountRulesPayload.LedgerAccount = r.body[0].id)
        .then(r =>  cloud.get(`/hubs/finance/dimensions`))
        .then(r => ledgerAccountRulesPayload.Dimension = r.body[0].id);
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
