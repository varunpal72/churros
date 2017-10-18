'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const salesCreditsPayload = tools.requirePayload(`${__dirname}/assets/sales-credits.json`);

suite.forElement('finance', 'sales-credits', { payload: salesCreditsPayload }, (test) => {
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => salesCreditsPayload.Company = r.body[0].id)
    .then(r => cloud.get(`/hubs/finance/currencies`))
    .then(r => salesCreditsPayload.Currency = r.body[0].id));
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
