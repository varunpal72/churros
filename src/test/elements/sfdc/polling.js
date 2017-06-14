'use strict';

const suite = require('core/suite');
const accountsPayload = require('./assets/accounts');
const contactsPayload = require('./assets/contacts');
const leadsPayload = require('./assets/leads');
const opportunitiesPayload = require('./assets/opportunities');

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'Account');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'Contact');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'Lead');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'Opportunity');
});
