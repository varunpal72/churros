'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/sales-quotes.json`);

suite.forElement('finance', 'sales-quotes', { payload: payload, skip: true }, (test) => { //payload issue
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.Company = r.body[0].id)
    .then(r => cloud.get(`/hubs/finance/currencies`))
    .then(r => payload.Currency = r.body[0].id)
    .then(r => cloud.get(`/hubs/finance/trade-document-types`))
    .then(r => payload.TradeDocumentType = r.body[0].id));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
