'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);

suite.forElement('finance', 'employees', { payload: employeesPayload }, (test) => {
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
