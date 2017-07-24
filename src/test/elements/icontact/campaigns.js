'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);

suite.forElement('general', 'campaigns', { payload: payload, skip: true }, (test) => {

  it('should allow CRUD for hubs/general/campaigns', () => {
    let campaignId;
    let updateCampaign = {
      "name": "Las Vegas Trip Money Building Campaign",
      "fromEmail": "stuartprice@hangover.com",
      "fromName": "Stuart Price",
      "forwardToFriend": 3,
      "clickTrackMode": 1,
      "subscriptionManagement": 1,
      "useAccountAddress": 1,
      "archiveByDefault": 1,
      "description": "He is funny because he is fat !"
    };
    return cloud.post(`${test.api}`, payload)
      .then(r => campaignId = r.body.campaignId)
      .then(r => cloud.get(`${test.api}`))
      .then(r => cloud.get(`${test.api}/${campaignId}`))
      .then(r => cloud.put(`${test.api}/${campaignId}`, updateCampaign));
  });
  test.should.supportPagination();
});
