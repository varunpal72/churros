'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = require('./assets/accounts');
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const listsPayload = tools.requirePayload(`${__dirname}/assets/lists.json`);
const workflowsPayload = require('./assets/workflows');

suite.forElement('marketing', 'polling', null, (test) => {
  test.withApi('/hubs/marketing/accounts').should.supportPolling(accountsPayload);
  test.withApi('/hubs/marketing/contacts').should.supportPolling(contactsPayload);
  test.withApi('/hubs/marketing/lists').should.supportPolling(listsPayload);
  test.withApi('/hubs/marketing/lists').should.supportPolling(listsPayload);
  test.withApi('/hubs/marketing/lists').should.supportPolling(listsPayload);
  test.withApi('/hubs/marketing/workflows').should.supportPolling(workflowsPayload);
  test.withApi('/hubs/marketing/workflows').should.supportPolling(workflowsPayload);
  test.withApi('/hubs/marketing/workflows').should.supportPolling(workflowsPayload);
});
