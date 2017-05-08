'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const importsPayload = require('./assets/imports');


suite.forElement('finance', 'imports',{ payload:importsPayload } , (test) => {
  let name;
  it('should support GET Jobs', () => {
    return cloud.get(`/hubs/finance/companies`)
      .then(r => importsPayload.Company = r.body[0].id);
    });
    test.should.supportCruds();
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].Status);
      });
    test
     .withName(`should support searching ${test.api} by Status`)
     .withOptions({ qs: { where:`Status  ='${name}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Status === `${name}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
