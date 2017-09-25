'use strict';

const suite = require('core/suite');
const payload = require('./assets/lists');
const tools = require('core/tools');
const cloud = require('core/cloud');
const contactsPayload = require('./assets/contacts');
const build = (overrides) => Object.assign({}, payload, overrides);
const listsPayload = build({ name: tools.random() });
const build1 = (overrides) => Object.assign({}, contactsPayload, overrides);
const contactPayload = build1({ first_name: tools.random() });


suite.forElement('marketing', 'lists', { payload: contactPayload }, (test) => {

  contactPayload.email_addresses[0].email_address = tools.randomEmail();
  const updatePayload = {
    "first_name": tools.random(),
    "email_addresses": [{
      "email_address": contactPayload.email_addresses[0].email_address
    }]
  };

  let listId;
  it(`should allow CRUDS + ${test.api}/:id/contacts`, () => {
    let id;
    return cloud.post(`/hubs/marketing/lists`, listsPayload)
      .then(r => listId = r.body.id)
      .then(r => cloud.post(`${test.api}/${listId}/contacts`, contactPayload))
      .then(r => id = r.body.id)
      .then(r => cloud.get(`${test.api}/${listId}/contacts`))
      .then(r => cloud.get(`${test.api}/${listId}/contacts/${id}`))
      .then(r => cloud.put(`${test.api}/${listId}/contacts/${id}`, updatePayload))
      .then(r => cloud.delete(`${test.api}/${listId}/contacts/${id}`))
      .then(r => cloud.delete(`/hubs/marketing/lists/${listId}`));
  });
});
