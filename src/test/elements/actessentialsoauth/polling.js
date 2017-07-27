'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const activitiesPayload = require('./assets/activities');
const contactsPayload = require('./assets/contacts');
const listsPayload = tools.requirePayload(`${__dirname}/assets/lists.json`);
const opportunitiesPayload = require('./assets/opportunities');

suite.forElement('crm', 'polling', (test) => {
  test.withApi('/hubs/crm/activities').should.supportPolling(activitiesPayload, 'activities');
  test.withApi('/hubs/crm/contacts').should.supportPolling(contactsPayload, 'contacts');
  test.withApi('/hubs/crm/lists').should.supportPolling(listsPayload, 'lists');
  test.withApi('/hubs/crm/opportunities').should.supportPolling(opportunitiesPayload, 'opportunities');
});
