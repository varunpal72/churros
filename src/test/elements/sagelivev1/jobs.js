'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const jobsPayload = tools.requirePayload(`${__dirname}/assets/jobs.json`);
const update = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'jobs', { payload: jobsPayload, skip: true }, (test) => {
  let i, j, k;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  i = (Math.floor(Math.random() * (12 - 1 + 1)) + 1);
  j = i + 1;
  k = j + 1;
  jobsPayload.CRONExpression = " " + j + " " + i + " " + k + " L * ?";
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
