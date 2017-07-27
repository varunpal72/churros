'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const activitiesPayload = require('./assets/activities');
const opportunitiesPayload = require('./assets/opportunities');

//netsuite isn't polling correctly, unskip when it works
suite.forElement('crm', 'polling', { skip: true }, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/crm/activities').should.supportPolling(activitiesPayload, 'activities');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
