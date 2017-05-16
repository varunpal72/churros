'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = require('./assets/accounts');
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const opportunitiesPayload = require('./assets/opportunities');
const tasksPayload = require('./assets/tasks');

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload);
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload);
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload);
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload);
  test.withApi('/hubs/crm/tasks').should.supportPolling(tasksPayload);
});
