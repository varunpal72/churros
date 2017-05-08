'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const settingPayload = require('./assets/consolidation-settings');

suite.forElement('finance', 'consolidation-settings',{ payload:settingPayload ,skip: true } , (test) => {
  it(`should support GET ${test.api}`, () => {
    return cloud.get(test.api)
    .then(r => {
                settingPayload.attributes.referenceId ="re" + tools.randomInt();
                settingPayload.Name= "name" + tools.randomInt();
                settingPayload.Period= (Math.floor(Math.random() * (10 - 1 + 1)) + 1);} );
    });

  test.should.supportCruds();
    test
     .withName(`should support searching ${test.api} by FinancialYear`)
     .withOptions({ qs: { where:`FinancialYear= 2017`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.FinancialYear === 2017);
     expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
   test.should.supportPagination();
  });
