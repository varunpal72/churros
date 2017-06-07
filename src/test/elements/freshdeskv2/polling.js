'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const incidentsPayload = tools.requirePayload(`${__dirname}/assets/incidents.json`);
var date = new Date();
date.setFullYear(date.getFullYear() + tools.randomInt());
incidentsPayload.due_by = date.toISOString();
incidentsPayload.fr_due_by = date.toISOString();
var types = ["Question", "Incident", "Problem", "Feature Request", "Lead"];
incidentsPayload.type = types[Math.floor(Math.random() * types.length)];
const contactsPayload = require('./assets/contacts');

suite.forElement('helpdesk', 'polling', null, (test) => {
  test.withApi('/hubs/helpdesk/incidents').should.supportPolling(incidentsPayload, 'incidents');
  test.withApi('/hubs/helpdesk/contacts').should.supportPolling(contactsPayload, 'contacts');
});
