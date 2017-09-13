'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const jobsPayload = tools.requirePayload(`${__dirname}/assets/job-tasks.json`);
const pre1Payload = tools.requirePayload(`${__dirname}/assets/employees.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/jobs.json`);

suite.forElement('finance', 'job-tasks', { payload: jobsPayload, skip: true }, (test) => {
  let id, id1, j, k, i;
  i = (Math.floor(Math.random() * (10 - 1 + 1)) + 1);
  j = i + 1;
  k = j + 1;
  prePayload.CRONExpression = " " + j + " " + i + " " + k + " L * ?";
  before(() => cloud.post(`/hubs/finance/jobs`, prePayload)
    .then(r => {
      id = r.body.id;
      jobsPayload.Job = id;
    })
    .then(r => cloud.post(`/hubs/finance/employees`, pre1Payload))
    .then(r => {
      id1 = r.body.id;
      jobsPayload.Employee = id1;
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
  after(() => cloud.delete(`/hubs/finance/employees/${id1}`)
    .then(r => cloud.delete(`/hubs/finance/jobs/${id}`)));
});
