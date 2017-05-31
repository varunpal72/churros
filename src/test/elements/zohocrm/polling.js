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

suite.forElement('ecommerce', 'polling', null, (test) => {
  test.withApi('/hubs/ecommerce/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/ecommerce/activity-calls').should.supportPolling(activityCallsPayload, 'activity-calls');
  test.withApi('/hubs/ecommerce/activity-events').should.supportPolling(activityEventsPayload, 'activity-events');
  test.withApi('/hubs/ecommerce/campaigns').should.supportPolling(campaignsPayload, 'campaigns');
  test.withApi('/hubs/ecommerce/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/ecommerce/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/ecommerce/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
