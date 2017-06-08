'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const payload = tools.requirePayload(`${__dirname}/assets/feed-broker-rules.json`);
const prepayload = tools.requirePayload(`${__dirname}/assets/feed-brokers.json`);

suite.forElement('finance', 'feed-broker-rules', { payload: payload }, (test) => {
  let id;
    before(() => cloud.post(`/hubs/finance/feed-brokers`, prepayload)
      .then(r => {
        id = r.body.id;
        payload.FeedBroker = id;
      }));
  test.should.supportCruds();
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
