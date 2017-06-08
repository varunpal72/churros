'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/payment-methods.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);

suite.forElement('finance', 'payment-methods', { payload: payload }, (test) => {
  let id;
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.Company = r.body[0].id)
    .then(r => cloud.post(`/hubs/finance/dimensions`, prePayload))
    .then(r => {
      id = r.body.id;
      payload.Dimension = id;
    }));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 'test');
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
