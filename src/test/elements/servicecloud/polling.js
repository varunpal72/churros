'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const incidentsPayload = tools.requirePayload(`${__dirname}/assets/incidents.json`);

suite.forElement('helpdesk', 'polling', (test) => {
  test.withApi('/hubs/helpdesk/incidents').should.supportPolling(incidentsPayload, 'incidents');
});
