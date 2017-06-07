'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const activityCallsPayload = tools.requirePayload(`${__dirname}/assets/activity-calls.json`);
const activityEventsPayload = tools.requirePayload(`${__dirname}/assets/activity-events.json`);
const campaignsPayload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);

suite.forElement('crm', 'polling', null, (test) => {
  test.withApi('/hubs/crm/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/crm/activity-calls').should.supportPolling(activityCallsPayload, 'activity-calls');
  test.withApi('/hubs/crm/activity-events').should.supportPolling(activityEventsPayload, 'activity-events');
  test.withApi('/hubs/crm/campaigns').should.supportPolling(campaignsPayload, 'campaigns');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
