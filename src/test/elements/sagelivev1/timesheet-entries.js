'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const timesheetEntriesPayload = tools.requirePayload(`${__dirname}/assets/timesheet-entries.json`);
const timesheetsPayload = tools.requirePayload(`${__dirname}/assets/timesheets.json`);
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);

suite.forElement('finance', 'timesheet-entries', { payload: timesheetEntriesPayload }, (test) => {
  let id1, id2;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/employees`, employeesPayload)
    .then(r => {
      timesheetsPayload.Employee = r.body.id;
      id1 = r.body.id;
    })
    .then(r =>  cloud.post(`/hubs/finance/timesheets`, timesheetsPayload))
    .then(r => {
      timesheetEntriesPayload.Timesheet = r.body.id;
      id2 = r.body.id;
    }));
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by Name`)
    .withOptions({ qs: { where: `Name  ='Test'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.Name === `Test`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
  after(() =>
  cloud.delete(`/hubs/finance/timesheets/${id2}`)
    .then(r => cloud.delete(`/hubs/finance/employees/${id1}`)));
});
