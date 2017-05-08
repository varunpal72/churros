'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const dimensionRulesPayload = require('./assets/dimension-rules');

suite.forElement('finance', 'dimension-rules',{ payload:dimensionRulesPayload } , (test) => {
  let id,updatedPayload;
  it('should support GET Dimension', () => {
    return cloud.get(`/hubs/finance/dimensions`)
      .then(r => dimensionRulesPayload.Dimension = r.body[0].id);
    });
    test.should.supportCrds();
    it(`should support PATCH ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Multiplicity": "Multiple"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
  test.should.supportPagination();
  test
   .withName(`should support searching ${test.api} by Multiplicity`)
   .withOptions({ qs: { where:`Multiplicity = 'Multiple'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Multiplicity === `Multiple`);
   expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
  });
