'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/consolidation-rates');

suite.forElement('finance', 'consolidation-rates',{ payload:payload } , (test) => {
  let id,company,updatedPayload;

  it('should support GET Company from /hubs/finance/companies', () => {
    return cloud.get(`/hubs/finance/companies`)
      .then(r => company = r.body[0].id)
      .then(r =>{ payload.Company = company;
                  payload.Key = "key" + tools.randomInt();
                  payload.FY = (Math.floor(Math.random() * (10 - 1 + 1)) + 1);
                  payload.Period= (Math.floor(Math.random() * (10 - 1 + 1)) + 1);} );
    });
  test.should.supportCrds();
  it('should support PATCH ${test.api}', () => {
    return cloud.get(test.api)
      .then(r => {id = r.body[0].id;
                  updatedPayload = {"Period": 22};  } )
      .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
    });
    test
     .withName(`should support searching ${test.api} by Period`)
     .withOptions({ qs: { where:`Period =22`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Period === 22);
     expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
   test.should.supportPagination();
  });
