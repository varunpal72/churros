'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const contactsApi = '/hubs/marketing/contacts';

suite.forElement('marketing', 'lists', null, (test) => {
  it(`should support CD for ${test.api} and ${contactsApi}, then CS ${test.api}/:listId/contacts`, () => {
    const email = tools.randomEmail();
    let listId, contactId, updatedPayload;
    return cloud.post(test.api, { name: tools.random() })
      .then(r => listId = r.body.id)
      .then(r => cloud.post(contactsApi, { email: email, firstName: tools.random(), lastName: tools.random() }))
      .then(r => contactId = r.body.id)
      .then(r => updatedPayload = [{ properties: { email: email }, vid: contactId }])
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, updatedPayload))
      .then(r => cloud.get(`${test.api}/${listId}/contacts`))
      //.then(r => cloud.delete(`${test.api}/${listId}/contacts/${contactId}`)) comment b/c error in hubspot ZH #4138
      .then(r => cloud.delete(`${test.api}/${listId}`))
      .then(r => cloud.delete(`${contactsApi}/${contactId}`));
  });
});
