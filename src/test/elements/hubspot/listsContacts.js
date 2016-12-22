'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');

suite.forElement('marketing', 'lists', null, (test) => {
  it('should create a contact then a list, and then add the contact to the list, get it, then remove it from list. Finally remove the list and contact', () => {
    const contactsApi = '/hubs/marketing/contacts';
    const email = tools.randomEmail();

    let listId;
    let contactId;
    let updatedPayload;

    return cloud.post(test.api, { name: tools.random() })
      .then(r => listId = r.body.id)
      .then(r => cloud.post(contactsApi, { email: email, firstName: tools.random(), lastName: tools.random() }))
      .then(r => contactId = r.body.id)
      .then(r => updatedPayload = [{ properties: { email: email }, vid: contactId }])
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, updatedPayload))
      .then(r => cloud.get(`${test.api}/${listId}/contacts`))
      //.then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`))
      .then(r => cloud.delete(`${test.api}/${listId}`))
      .then(r => cloud.delete(`${contactsApi}/${contactId}`));
  });
});
