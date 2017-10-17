'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const employeePayload = tools.requirePayload(`${__dirname}/assets/employee.json`);
const employeeUpdatePayload = tools.requirePayload(`${__dirname}/assets/employeeUpdate.json`);

suite.forElement('employee', 'employees', (test) => {

  test.should.supportPagination();
  test.withOptions({ qs: { where: "status='active'" } }).should.return200OnGet();
  test.withOptions({ qs: { where: "begin_updated_at='2017-09-02T19:11:18Z'" } }).should.return200OnGet();
  test.withOptions({ qs: { where: "end_updated_at='2017-09-20T19:11:18Z'" } }).should.return200OnGet();
  test.withOptions({ qs: { where: "begin_created_at='2017-09-15T19:58:11Z'" } }).should.return200OnGet();

  it('should allow CRU for employees', () => {
    let empId, len;
    return cloud.post(`${test.api}`, employeePayload)
    .then(r => empId = r.body.id)
    .then(r => cloud.get(`${test.api}/${empId}`))
    .then(r => cloud.patch(`${test.api}/${empId}`, employeeUpdatePayload));
  });
});
