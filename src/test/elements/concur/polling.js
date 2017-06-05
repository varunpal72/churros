'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const reportsPayload = tools.requirePayload(`${__dirname}/assets/reports.json`);

suite.forElement('expense', 'polling', null, (test) => {
  test.withApi('/hubs/expense/reports').should.supportPolling(reportsPayload, 'reports');
});
