'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);

// The default value is messed up and its not working
suite.forElement('crm', 'polling', {skip: true}, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
