'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const feedsPayload = tools.requirePayload(`${__dirname}/assets/feeds.json`);
const prePayload = tools.requirePayload(`${__dirname}/assets/feed-brokers.json`);
const updatePayload = tools.requirePayload(`${__dirname}/assets/updatePayload.json`);

suite.forElement('finance', 'feeds', { payload: feedsPayload }, (test) => {
  let id;
  const options = {
    churros: {
      updatePayload: updatePayload
    }
  };
  before(() => cloud.post(`/hubs/finance/feed-brokers`, prePayload)
    .then(r => {
      id = r.body.id;
      feedsPayload.FeedBroker = id;
    }));
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
  after(() => cloud.delete(`/hubs/finance/feed-brokers/${id}`));
});
