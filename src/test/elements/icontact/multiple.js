'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const contacts = tools.requirePayload(`${__dirname}/assets/multipleContacts.json`);
const lists = tools.requirePayload(`${__dirname}/assets/multipleLists.json`);
const campaigns = tools.requirePayload(`${__dirname}/assets/multipleCampaigns.json`);
const messages = tools.requirePayload(`${__dirname}/assets/multipleMessages.json`);

suite.forElement('general', 'multiple', (test) => {

  it('should allow CUD for hubs/general/multiple/contacts', () => {
    let contactIds = [];
    return cloud.post(`${test.api}/contacts`, contacts)
      .then(r => r.body.forEach(function(entry) {
        if (entry.contactId)
          contactIds.push(entry.contactId);
      }))
      .then(r => {
        for (let i = 0; i < contactIds.length; i++) {
          contacts[i].contactId = contactIds[i];
        }
      })
      .then(r => cloud.put(`${test.api}/contacts`, contacts))
      .then(r => contactIds.forEach(function(entry) {
        cloud.delete(`hubs/general/contacts/${entry}`);
      }));
  });

  it('should allow CUD for hubs/general/multiple/lists', () => {
    let listIds = [];
    return cloud.post(`${test.api}/lists`, lists)
      .then(r => r.body.forEach(function(entry) {
        if (entry.listId)
          listIds.push(entry.listId);
      }))
      .then(r => {
        for (let i = 0; i < listIds.length; i++) {
          lists[i].listId = listIds[i];
        }
      })
      .then(r => cloud.put(`${test.api}/lists`, lists))
      .then(r => listIds.forEach(function(entry) {
        cloud.delete(`hubs/general/lists/${entry}`);
      }));
  });

  it.skip('should allow CU for hubs/general/multiple/campaigns', () => {
    let campaignIds = [];
    return cloud.post(`${test.api}/campaigns`, campaigns)
      .then(r => r.body.forEach(function(entry) {
        if (entry.campaignId)
          campaignIds.push(entry.campaignId);
      }))
      .then(r => {
        for (let i = 0; i < campaignIds.length; i++) {
          campaigns[i].campaignId = campaignIds[i];
        }
      })
      .then(r => cloud.put(`${test.api}/campaigns`, campaigns));
  });

  it.skip('should allow CU for hubs/general/multiple/messages', () => {
    let messageIds = [];
    let campaignPayload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);

    for (let j = 0; j < messages.length; j++) {
      return cloud.post('hubs/general/campaigns', campaignPayload)
        .then(r => messages.campaignId = r.body.campaignId);
    }

    return cloud.post(`${test.api}/messages`, messages)
      .then(r => r.body.forEach(function(entry) {
        if (entry.messageId)
          messageIds.push(entry.messageId);
      }))
      .then(r => {
        for (let i = 0; i < messageIds.length; i++) {
          messages[i].messageId = messageIds[i];
        }
      })
      .then(r => cloud.put(`${test.api}/messages`, messages));
  });
});
