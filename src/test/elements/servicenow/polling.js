'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const agentsPayload = tools.requirePayload(`${__dirname}/assets/agents.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const incidentsPayload = require('./assets/incidents');

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/agents').should.supportPolling(agentsPayload, 'agents');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/incidents').should.supportPolling(incidentsPayload, 'incidents');
});
