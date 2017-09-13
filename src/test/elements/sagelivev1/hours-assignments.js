'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const hoursAssignmentsPayload = tools.requirePayload(`${__dirname}/assets/hours-assignments.json`);
const hoursProfilesPayload = tools.requirePayload(`${__dirname}/assets/hours-profiles.json`);
const employeesPayload = tools.requirePayload(`${__dirname}/assets/employees.json`);
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);

suite.forElement('finance', 'hours-assignments', { payload: hoursAssignmentsPayload }, (test) => {
  let id1, id2;
  const options = {
    churros: {
      updatePayload: update
    }
  };
  before(() => cloud.post(`/hubs/finance/hours-profiles`, hoursProfilesPayload)
    .then(r => {
      id1 = r.body.id;
      hoursAssignmentsPayload.HoursProfile = r.body.id;
    })
    .then(r => cloud.post(`/hubs/finance/employees`, employeesPayload))
    .then(r => {
      id2 = r.body.id;
      hoursAssignmentsPayload.Employee = r.body.id;
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
  after(() => cloud.delete(`/hubs/finance/employees/${id2}`)
    .then(r => cloud.delete(`/hubs/finance/hours-profiles/${id1}`)));
});
