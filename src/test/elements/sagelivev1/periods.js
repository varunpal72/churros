'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/periods.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'periods', { payload: payload }, (test) => {
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.get(`/hubs/finance/companies`)
    .then(r => payload.ParentCompany = r.body[0].id));
  test.withOptions(options).should.supportCruds();
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
