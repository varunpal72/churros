'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = require('./assets/rule-sets-by-feeds');
const update = tools.requirePayload(`${__dirname}/assets/updateUid.json`);
const pre1Payload = tools.requirePayload(`${__dirname}/assets/feeds.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/feed-brokers.json`);
const options = {
  churros: {
    updatePayload: update
  }
};
suite.forElement('finance', 'rule-sets-by-feeds', { payload: payload }, (test) => {
  let id,id1,id2;

  it('should support POST Feed and FeedBroker', () => {
    return cloud.post(`/hubs/finance/feed-brokers`, prePayload)
    .then(r => {
      id = r.body.id;
      pre1Payload.FeedBroker = r.body.id;
    })
    .then(r => cloud.post(`/hubs/finance/feeds`, pre1Payload))
    .then(r => {
      id1 = r.body.id;
      payload.Feed = id1;
    })
    .then(r => cloud.post(`/hubs/finance/feed-rule-sets`, pre1Payload))
    .then(r => {
      id2 = r.body.id;
      payload.FeedRuleSet = id2;
    });
  });
  test.withOptions(options).should.supportCruds();
  test.should.supportPagination();
  test
     .withName(`should support searching ${test.api} by Name`)
     .withOptions({ qs: { where: `Name  ='test'` } })
     .withValidation((r) => {
         expect(r).to.have.statusCode(200);
         const validValues = r.body.filter(obj => obj.Name === 'test');
         expect(validValues.length).to.equal(r.body.length);
       }).should.return200OnGet();
 it('should support DELETE feeds,feed-rule-sets and feed-brokers', () => {
 return cloud.delete(`/hubs/finance/feeds/${id1}`)
   .then(r => cloud.delete(`/hubs/finance/feed-brokers/${id}`))
   .then(r => cloud.delete(`/hubs/finance/feed-rule-sets/${id2}`));
 });
});
