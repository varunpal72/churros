'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/invoices.json`);

suite.forElement('finance', 'invoices',{ payload:payload,skip:true} , (test) => { //payload issue
  let name ;

    before(() => cloud.get(`/hubs/finance/accounts`)
      .then(r => payload.Account = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/companies`))
      .then(r => payload.Company = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/tax-treatments`))
      .then(r => payload.TaxTreatment = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/tax-codes`))
      .then(r => payload.TaxCode = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/trade-document-types`))
      .then(r => payload.TradeDocumentType = r.body[0].id));
    test.should.supportCruds();
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].Reference);
      });
      test
       .withName(`should support searching ${test.api} by Reference`)
       .withOptions({ qs: { where:`Reference  ='${name}'`} })
       .withValidation((r) => {
       expect(r).to.have.statusCode(200);
       const validValues = r.body.filter(obj => obj.Reference === `${name}`);
       expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
    });
