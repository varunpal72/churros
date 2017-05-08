'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/feeds');
const build = (overrides) => Object.assign({}, payload, overrides);
const feedsPayload = build({Name: "name" + tools.randomInt()});

suite.forElement('finance', 'feeds',{ payload:feedsPayload } , (test) => {
  let id,updatedPayload ;
  it('should support GET FeedBroker and JournalType', () => {
    return cloud.get(`/hubs/finance/feed-brokers`)
      .then(r => feedsPayload.FeedBroker = r.body[0].id)
      .then(r => cloud.get(`/hubs/finance/journal-types`))
      .then(r => feedsPayload.JournalType = r.body[0].id);
    });
    test.should.supportCrds();
    it('should support PATCH ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => {id = r.body[0].id;
                    updatedPayload = {"Name": "ce1"};  } )
        .then(r => cloud.patch(`${test.api}/${id}`, updatedPayload) );
      });
    test.should.supportPagination();

      test
       .withName(`should support searching ${test.api} by Name`)
       .withOptions({ qs: { where:`Name  ='ce1'`} })
       .withValidation((r) => {
       expect(r).to.have.statusCode(200);
       const validValues = r.body.filter(obj => obj.Name === `ce1`);
       expect(validValues.length).to.equal(r.body.length);
     }).should.return200OnGet();
    });
