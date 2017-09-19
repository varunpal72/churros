'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const reportDimensionDataPayload = tools.requirePayload(`${__dirname}/assets/report-dimension-data.json`);

suite.forElement('finance', 'report-dimension-data', { payload: reportDimensionDataPayload }, (test) => {
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => reportDimensionDataPayload.Company = r.body[0].id));
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
