'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/financial-reports');
const build = (overrides) => Object.assign({}, payload, overrides);
const financialReportsPayload = build({Description: "desc" + tools.randomInt()});

suite.forElement('finance', 'financial-reports',{ payload:financialReportsPayload } , (test) => {
  let name ;
    test.should.supportCruds();
    test.should.supportPagination();
    it(`should support GET ${test.api}`, () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].Description);
      });
      test
       .withName(`should support searching ${test.api} by Description`)
       .withOptions({ qs: { where:`Description  ='${name}'`} })
       .withValidation((r) => {
       expect(r).to.have.statusCode(200);
       const validValues = r.body.filter(obj => obj.Description === `${name}`);
       expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
    });
