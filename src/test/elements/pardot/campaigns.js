'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const payload = require('./assets/campaigns');
const contactsPayload = require('./assets/contacts');

contactsPayload.email = tools.randomEmail();

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withName('should support searching campaigns by created_after').withOptions({ qs: { where: 'created_after=\'2015-01-01\'' } }).should.return200OnGet();

  it('should allow PUT for /hubs/marketing/campaigns/:id/contacts', () => {
    let campaignId, contactId, contactCampaignPayload;
    return cloud.get(test.api)
      .then(r => campaignId = r.body[0].id)
      .then(r => cloud.post(`/hubs/marketing/contacts`, contactsPayload))
      .then(r => contactId = r.body.id)
      .then(r => contactCampaignPayload = [{ "id": contactId }])
      .then(r => cloud.put(`${test.api}/${campaignId}/contacts`, contactCampaignPayload))
      .then(r => cloud.delete(`/hubs/marketing/contacts/${contactId}`));
  });
});
