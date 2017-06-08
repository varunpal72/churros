'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/capacities.json`);
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);

suite.forElement('finance', 'capacities', { payload: payload }, (test) => {
  let number;
  before(() => cloud.post('/hubs/finance/employees', employeesPayload)
      .then(r => {
        payload.Employee = r.body.id;
        number = r.body.id;
      }));
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Month  =10` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name ===10);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
    after(() => cloud.delete(`/hubs/finance/employees/${number}`));
});
