'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const tools = require('core/tools');
const workTimerPayload = require('./assets/work-timers');
const prePayload = tools.requirePayload(`${__dirname}/assets/employees.json`);

suite.forElement('finance', 'work-timers', { payload: workTimerPayload }, (test) => {
  let id;
  before(() => cloud.post(`/hubs/finance/employees`,prePayload)
      .then(r => { id =r.body.id;
        workTimerPayload.Employee = r.body.id;}));
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
  after(() => cloud.delete(`/hubs/finance/employees/${id}`));
});
