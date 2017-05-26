'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const accountsPayload = require('./assets/accounts');
const contactsPayload = require('./assets/contacts');
const tasksPayload = require('./assets/tasks');

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/tasks').should.supportPolling(tasksPayload, 'tasks');
});
