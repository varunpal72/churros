'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const hoursAssignmentsPayload = require('./assets/hours-assignments');

suite.forElement('finance', 'hours-assignments',{ payload:hoursAssignmentsPayload ,skip :true} , (test) => {
  let name ;
  it('should support GET feed-executions', () => {
    return cloud.get(`/hubs/finance/hours-profiles`)
      .then(r => hoursAssignmentsPayload.HoursProfile = r.body[0].id)
      .then(r =>  cloud.get(`/hubs/finance/employees`))
      .then(r => hoursAssignmentsPayload.Employee = r.body[0].id);
    });
    test.should.supportCruds();
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].HoursProfile);
      });
      test
       .withName(`should support searching ${test.api} by HoursProfile`)
       .withOptions({ qs: { where:`HoursProfile  ='${name}'`} })
       .withValidation((r) => {
       expect(r).to.have.statusCode(200);
       const validValues = r.body.filter(obj => obj.HoursProfile === `${name}`);
       expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
    });
