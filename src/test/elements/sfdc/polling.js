'use strict';

//dependencies at the top
const suite = require('core/suite');
const tools = require('core/tools');
//how to import payloads
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);

suite.forElement('crm', 'polling', (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'Account');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'Contact');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'Lead');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'Opportunity');
});
