'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const financialYearsPayload = tools.requirePayload(`${__dirname}/assets/financial-years.json`);

suite.forElement('finance', 'financial-years', { payload: financialYearsPayload, skip: true }, (test) => {
  let number = "0050Y00" + Math.random(10).toPrecision(3).replace("\.", "") + "d9mwQAA";
  financialYearsPayload.SetupOwnerId = number;
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
