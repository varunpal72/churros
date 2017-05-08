'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/currency-exchange-rates');
const build = (overrides) => Object.assign({}, payload, overrides);
const exchangeratePayload = build({ Label: "label" + tools.randomInt()});

suite.forElement('finance', 'currency-exchange-rates',{ payload:exchangeratePayload } , (test) => {
  let id,updatedPayload;
  it('should support GET Currency', () => {
    return cloud.get(`/hubs/finance/currencies`)
      .then(r => exchangeratePayload.Currency = r.body[0].id);
    });
    test.should.supportCrds();
    it('should support PATCH ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = { "Rate": 1.46856};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
  test.should.supportPagination();
  test
   .withName(`should support searching ${test.api} by Rate`)
   .withOptions({ qs: { where:`Rate  =1.46856`} })
   .withValidation((r) => {
   expect(r).to.have.statusCode(200);
   const validValues = r.body.filter(obj => obj.Rate === 1.46856);
   expect(validValues.length).to.equal(r.body.length);
 }).should.return200OnGet();
  });
