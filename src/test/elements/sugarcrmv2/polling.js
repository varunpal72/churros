'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const accountsPayload = tools.requirePayload(`${__dirname}/assets/accounts.json`);
const contactsPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);
const leadsPayload = tools.requirePayload(`${__dirname}/assets/leads.json`);
const opportunitiesPayload = tools.requirePayload(`${__dirname}/assets/opportunities.json`);
const tasksPayload = tools.requirePayload(`${__dirname}/assets/tasks.json`);
const activitiesEmailsPayload = tools.requirePayload(`${__dirname}/assets/activitiesEmails.json`);
const activitiesCallsPayload = tools.requirePayload(`${__dirname}/assets/activitiesCalls.json`);
const activitiesEventsPayload = tools.requirePayload(`${__dirname}/assets/activitiesEvents.json`);
const campaignsPayload = tools.requirePayload(`${__dirname}/assets/campaigns.json`);
const incidentsPayload = tools.requirePayload(`${__dirname}/assets/incidents.json`);

suite.forElement('finance', 'polling', null, (test) => {
  test.withApi('/hubs/finance/accounts').should.supportPolling(accountsPayload, 'accounts');
  test.withApi('/hubs/finance/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/finance/leads').should.supportPolling(leadsPayload, 'leads');
  test.withApi('/hubs/finance/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
  test.withApi('/hubs/finance/tasks').should.supportPolling(tasksPayload, 'tasks');
  test.withApi('/hubs/finance/activities-emails').should.supportPolling(activitiesEmailsPayload, 'activities-emails');
  test.withApi('/hubs/finance/activities-calls').should.supportPolling(activitiesCallsPayload, 'activities-calls');
  test.withApi('/hubs/finance/activities-events').should.supportPolling(activitiesEventsPayload, 'activities-events');
  test.withApi('/hubs/finance/campaigns').should.supportPolling(campaignsPayload, 'campaigns');
  test.withApi('/hubs/finance/incidents').should.supportPolling(incidentsPayload, 'incidents');
});
