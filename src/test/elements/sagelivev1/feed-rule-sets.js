'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const tools = require('core/tools');
const cloud = require('core/cloud');
const prePayload = tools.requirePayload(`${__dirname}/assets/feed-brokers.json`);
const feedRuleSetsPayload = tools.requirePayload(`${__dirname}/assets/feed-rule-sets.json`);

suite.forElement('finance', 'feed-rule-sets',{ payload:feedRuleSetsPayload } , (test) => {
  let id ;
  before(() => cloud.post(`/hubs/finance/feed-brokers`, prePayload)
    .then(r => {
      id = r.body.id;
      feedRuleSetsPayload.FeedBroker = id;
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
