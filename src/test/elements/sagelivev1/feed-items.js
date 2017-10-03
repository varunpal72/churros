'use strict';

const suite = require('core/suite');
const expect = require('chakram').expect;
const feedItemsPayload = require('./assets/feed-items');

suite.forElement('finance', 'feed-items', { payload: feedItemsPayload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
  test
    .withName(`should support searching ${test.api} by status`)
    .withOptions({ qs: { where: `status  ='Ready'` } })
    .withValidation((r) => {
      expect(r).to.have.statusCode(200);
      const validValues = r.body.filter(obj => obj.status === `Ready`);
      expect(validValues.length).to.equal(r.body.length);
    }).should.return200OnGet();
});
