'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const contactsPayload = require('./assets/contacts');
const tools = require('core/tools');
const build = (overrides) => Object.assign({}, contactsPayload, overrides);
const contactUpdatePayload = build({ lastName: tools.random(), firstName: tools.random(), emailAddress: tools.randomEmail() });

contactsPayload.emailAddress = tools.randomEmail();

suite.forElement('marketing', 'campaigns', null, (test) => {
  it('should allow GET for /hubs/marketing/campaigns', () => {
    let campaignId,contactId,contactPostPayload,id=18;
    return cloud.get(test.api)
      .then(r => campaignId = r.body[0].id)
      .then(r => cloud.withOptions({ qs: { where: `id='${campaignId}'` } }).get(`${test.api}`))
      .then(r => cloud.withOptions({ qs: { page: 1, pageSize: 1 } }).get(`${test.api}`))
      .then(r => cloud.post(`/hubs/marketing/contacts`,contactsPayload))
      .then(r => contactId = r.body.id)
      .then(r => contactPostPayload = [{ "id": contactId }])
      .then(r => cloud.put(`${test.api}/${id}/contacts`,contactPostPayload))
      .then(r => cloud.delete(`${test.api}/${id}/contacts/${contactId}`))


  });
});
