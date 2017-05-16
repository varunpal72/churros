'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = require('./assets/accounts');
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const listsPayload = tools.requirePayload(`${__dirname}/assets/lists.json`);
const workflowsPayload = require('./assets/workflows');

suite.forElement('marketing', 'polling', null, (test) => {
  test.withApi('/hubs/marketing/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/marketing/contacts').should.supportPolling(contactsPayload, 'contacts');
});
