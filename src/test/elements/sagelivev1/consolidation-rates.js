'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/consolidation-rates.json`);

suite.forElement('finance', 'consolidation-rates', { payload: payload, skip: true }, (test) => {
  const options = {
    churros: {
      updatePayload: { "Period": 22 }
    }
  };
  payload.Period = (Math.floor(Math.random() * (10 - 1 + 1)) + 1);
  payload.FY = (Math.floor(Math.random() * (10 - 1 + 1)) + 1);
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => {
      payload.Company = r.body[0].id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Period`)
    .withOptions({ qs: { where: `Period  = 100` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === 100);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
