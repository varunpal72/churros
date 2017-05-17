'use strict';

const suite = require('core/suite');
const accountsPayload = require('./assets/accounts');
const contactsPayload = require('./assets/contacts');
const leadsPayload = require('./assets/leads');
const opportunitiesPayload = require('./assets/opportunities');

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
