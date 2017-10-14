'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/dimensions.json`);

suite.forElement('finance', 'customers', { payload: customersPayload }, (test) => {
  let id;
    before(() =>  cloud.get(`/hubs/finance/companies`)
      .then(r => customersPayload.Company = r.body[0].id)
      .then(r => cloud.post(`/hubs/finance/dimensions`, prePayload))
      .then(r => {
        id = r.body.id;
        customersPayload.Dimension = id;
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
    after(() => cloud.delete(`/hubs/finance/dimensions/${id}`));
});
