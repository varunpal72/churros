'use strict';
const suite = require('core/suite');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/users.json`);
const employeePayload = tools.requirePayload(`${__dirname}/assets/employees.json`);
const employmentPayload = tools.requirePayload(`${__dirname}/assets/employment.json`);
const jobPayload = tools.requirePayload(`${__dirname}/assets/job.json`);
const personalPayload = tools.requirePayload(`${__dirname}/assets/personal.json`);
const cloud = require('core/cloud');
const expect = require('chakram').expect;

suite.forElement('Humancapital', 'employees', { payload: employeePayload }, (test) => {
  let userId, employeeId;
  before((done) => cloud.post('/users', payload)
    .then(r => {
      userId = r.body.userId;
      employeePayload.userId = userId;
    })
    .then(r => cloud.post(test.api, employeePayload))
    .then(r => employeeId = employeePayload.personIdExternal)
    .then(r => done()));

// /employees/employment
  it(`should allow CRS for ${test.api}/employment`, () => {
    employmentPayload.userId=userId;
    employmentPayload.personIdExternal=employeeId;
    return cloud.post(`${test.api}/employment`, employmentPayload)
      .then(r => cloud.withOptions({ qs: { personExternalId: employeeId }}).get(`${test.api}/employment/${userId}`))
      .then(r => cloud.get(`${test.api}/employment`));
  });
  test.withApi(`${test.api}/employment`).should.supportPagination();
  it(`should allow CEQL search for ${test.api}/employment`, () => {
    return cloud.withOptions({ qs: { where: `userId='${userId}'` } }).get(`${test.api}/employment`)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);
        expect(r.body[0].userId).to.equal(userId);
      });
  });

// /employees/job
  it(`should allow CRS for ${test.api}/job`, () => {
    jobPayload.userId=userId;
    return cloud.post(`${test.api}/job`, jobPayload)
      .then(r => cloud.get(`${test.api}/job`));
  });
  test.withApi(`${test.api}/job`).should.supportPagination();
  it(`should allow CEQL search for ${test.api}/job`, () => {
    return cloud.withOptions({ qs: { where: `userId='${userId}'` } }).get(`${test.api}/job`)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);
        expect(r.body[0].userId).to.equal(userId);
      });
  });

// /employees/personal
  it(`should allow CRS for ${test.api}/personal`, () => {
    personalPayload.personIdExternal=employeeId;
    return cloud.post(`${test.api}/personal`, personalPayload)
      .then(r => cloud.get(`${test.api}/personal`));
  });
  test.withApi(`${test.api}/job`).should.supportPagination();
  it(`should allow CEQL search for ${test.api}/personal`, () => {
    return cloud.withOptions({ qs: { where: `personIdExternal='${employeeId}'` } }).get(`${test.api}/personal`)
      .then(r => {
        expect(r.body).to.not.be.empty;
        expect(r.body.length).to.equal(1);
        expect(r.body[0].personIdExternal).to.equal(employeeId);
      });

  });
});
