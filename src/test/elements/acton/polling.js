'use strict';

const suite = require('core/suite');
const cloud = require('core/cloud');
const tools = require('core/tools');
const contactPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

const addContact = (r) => cloud.get('/hubs/marketing/lists')
  .then(r => r.body.filter(r => r.id))
  .then(filteredLists => cloud.post(`/hubs/marketing/lists/${filteredLists[0].id}/contacts`, r));

suite.forElement('marketing', 'polling', (test) => {
  test.should.supportPolling(contactPayload, 'contacts', addContact);
});
