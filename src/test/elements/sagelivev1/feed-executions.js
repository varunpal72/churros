'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/feed-executions');
const build = (overrides) => Object.assign({}, payload, overrides);
const feedExecutionsPayload = build({ Status: "Ready",Result: "result" + tools.randomInt()});

suite.forElement('finance', 'feed-executions',{ payload:feedExecutionsPayload } , (test) => {
  let result, id,updatedPayload ;
  it('should support GET Feed', () => {
    return cloud.get(`/hubs/finance/feeds`)
      .then(r => feedExecutionsPayload.Feed = r.body[0].id);
    });
    test.should.supportCrds();
    it('should support PATCH ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Result": "Stable"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
    test.should.supportPagination();
    it('should support GET ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => result = r.body[0].Result);
      });
    test
     .withName(`should support searching ${test.api} by Result`)
     .withOptions({ qs: { where:`Result  ='${result}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.Result === `${result}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
