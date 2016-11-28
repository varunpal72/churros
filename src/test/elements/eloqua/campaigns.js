'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');

suite.forElement('marketing', 'campaigns', null , (test) => {
 it('should allow GET for /hubs/marketing/campaigns', () => {
    let campaignId;
    return cloud.get(test.api)
      .then(r =>campaignId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `id='${campaignId}'` } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}`));
  });  
});
