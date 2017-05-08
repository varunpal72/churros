'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const cloud = require('core/cloud');
const feedItemsPayload = require('./assets/feed-items');

suite.forElement('finance', 'feed-items',{ payload:feedItemsPayload } , (test) => {
  let name;
  it('should support GET feed-executions', () => {
    return cloud.get(`/hubs/finance/feed-executions`)
      .then(r => feedItemsPayload.FeedExecution = r.body[0].id);
    });
    test.should.supportCruds();
    test.should.supportPagination();
    it('should support GET ${test.api}', () => {
      return cloud.get(test.api)
        .then(r => name = r.body[0].status);
      });
    test
     .withName(`should support searching ${test.api} by status`)
     .withOptions({ qs: { where:`status  ='${name}'`} })
     .withValidation((r) => {
     expect(r).to.have.statusCode(200);
     const validValues = r.body.filter(obj => obj.status === `${name}`);
     expect(validValues.length).to.equal(r.body.length);
   }).should.return200OnGet();
  });
