'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/campaigns');

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  test.should.supportPagination();
  test.withOptions({ qs: { where: `updated_from ='2017-01-19'` } }).should.return200OnGet();
  it(`should support SRU for ${test.api}`, () => {
    let campaignId;
    return cloud.get(test.api)
      .then(r => campaignId = r.body[0].ID)
      .then(r => cloud.get(`${test.api}/${campaignId}`))
      .then(r => cloud.patch(`/hubs/marketing/campaigns/1`, payload));
  });
});