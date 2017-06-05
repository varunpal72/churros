'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const reportsPayload = tools.requirePayload(`${__dirname}/assets/reports.json`);

suite.forElement('payment', 'polling', null, (test) => {
  test.withApi('/hubs/payment/reports').should.supportPolling(reportsPayload, 'reports');
});
