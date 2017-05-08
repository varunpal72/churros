'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/expansion-type-rules');
const build = (overrides) => Object.assign({}, payload, overrides);
const expansionTypeRulesPayload = build({ Value: "value" + tools.randomInt()});

suite.forElement('finance', 'expansion-type-rules',{ payload:expansionTypeRulesPayload } , (test) => {
  let id,updatedPayload;
  it('should support GET ExpansionType', () => {
    return cloud.get(`/hubs/finance/expansion-types`)
      .then(r => expansionTypeRulesPayload.ExpansionType = r.body[0].id);
    });
    test.should.supportCrds();
    it(`should support PATCH ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Value": "ce"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
  test.should.supportPagination();
  test
   .withName(`should support searching ${test.api} by Value`)
   .withOptions({ qs: { where:`Value  ='ce'`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Value === `ce`);
   expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
  });
