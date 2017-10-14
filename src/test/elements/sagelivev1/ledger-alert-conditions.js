'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const ledgerAlertsConditionPayload= require('./assets/ledger-alert-conditions');
const prePayload = tools.requirePayload(`${__dirname}/assets/ledger-alerts.json`);

suite.forElement('finance', 'ledger-alert-conditions',{ payload:ledgerAlertsConditionPayload } , (test) => {
  let id;
  const options = {
    churros: {
      updatePayload:  {"Operator": "="}
    }
  };
  before(() =>  cloud.post(`/hubs/finance/ledger-alerts`, prePayload)
      .then(r =>{
        ledgerAlertsConditionPayload.LedgerAlert = r.body.id;
        id =  r.body.id ;
      }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Operator`)
    .withOptions({ qs: { where: `Operator  = '='` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Operator === '=');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() =>  cloud.delete(`/hubs/finance/ledger-alerts/${id}`));
});
