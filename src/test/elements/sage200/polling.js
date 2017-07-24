'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const customersPayload = tools.requirePayload(`${__dirname}/assets/customers.json`);

// Failed because of other errors occuring with sage200
suite.forElement('finance', 'polling', { skip:true }, (test) => {
  test.withApi('/hubs/finance/customers').should.supportPolling(customersPayload, 'customers');
});
