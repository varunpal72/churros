'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/capacities');
const employeesPayload = require('./assets/employees');

suite.forElement('finance', 'capacities',{ payload:payload,employeesPayload } , (test) => {
  let number;
  it('should support GET employees', () => {
    return cloud.post('/hubs/finance/employees',employeesPayload)
    .then(r => number = r.body.id)
    .then(r => { payload.Employee=number;
                 payload.attributes.referenceId="re" + tools.randomInt();} );
    });
  test.should.supportCruds();
  test.should.supportPagination();
  test
   .withName(`should support searching ${test.api} by year`)
   .withOptions({ qs: { where:`Year  = 2017`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Year === 2017);
   expect(validValues.length).to.equal(r.body.length);
  }).should.return200OnGet();
  it('should support DELETED employee', () => {
   return cloud.delete(`/hubs/finance/employees/${number}`);
   });
  });
