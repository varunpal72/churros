'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const feedExecutionsPayload = require('./assets/feed-executions');
const pre1Payload = tools.requirePayload(`${__dirname}/assets/feeds.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/feed-brokers.json`);

suite.forElement('finance', 'feed-executions', { payload: feedExecutionsPayload }, (test) => {
  let id,id1;
  const options = {
    churros: {
      updatePayload: { "Result": "Stable" }
    }
  };

before(() =>  cloud.post(`/hubs/finance/feed-brokers`, prePayload)
    .then(r => {
      id = r.body.id;
      pre1Payload.FeedBroker = id;
    })
    .then(r => cloud.post(`/hubs/finance/feeds`, pre1Payload))
    .then(r => {
      id1 = r.body.id;
      feedExecutionsPayload.Feed = id1;
    }));
   test.withOptions(options).should.supportCruds();
   test.should.supportPagination();
   test
      .withName(`should support searching ${test.api} by Result`)
      .withOptions({ qs: { where: `Result  ='test'` } })
      .withValidation((r) => {
          expect(r).to.have.statusCode(200);
          const validValues = r.body.filter(obj => obj.Result === 'test');
          expect(validValues.length).to.equal(r.body.length);
        }).should.return200OnGet();
  after(() =>cloud.delete(`/hubs/finance/feeds/${id1}`)
    .then(r => cloud.delete(`/hubs/finance/feed-brokers/${id}`)));
});
