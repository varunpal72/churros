'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const payload = require('./assets/campaigns');
const contactsPayload = require('./assets/contacts');
const leadsPayload = require('./assets/leads');

suite.forElement('marketing', 'campaigns', { payload: payload }, (test) => {
  test.should.supportCrus();
  test.withOptions({ qs: { page: 1, pageSize: 5 } }).should.return200OnGet();
  test.withName('should support searching campaigns by created_after').withOptions({ qs: { where: 'created_after=\'2015-01-01\'' } }).should.return200OnGet();

  it('should allow PUT for /campaigns/:id/contacts and /campaigns/:id/leads', () => {
    let campaignId, contactId, leadId, contactCampaignPayload, leadCampaignPayload;
    return cloud.get(test.api)
      .then(r => campaignId = r.body[0].id)
      .then(r => cloud.post(`/hubs/marketing/contacts`, contactsPayload))
      .then(r => contactId = r.body.id)
      .then(r => contactCampaignPayload = [{ "id": contactId }])
      .then(r => cloud.put(`${test.api}/${campaignId}/contacts`, contactCampaignPayload))
      .then(r => cloud.post(`/hubs/marketing/leads`, leadsPayload))
      .then(r => leadId = r.body.id)
      .then(r => leadCampaignPayload = [{ "id": leadId }])
      .then(r => cloud.put(`${test.api}/${campaignId}/leads`, leadCampaignPayload))
      .then(r => cloud.delete(`/hubs/marketing/contacts/${contactId}`));
  });
});
