'use strict';

const suite = require('core/suite');
const accountPayload = require('./assets/accounts');

suite.forElement('marketing', 'polling', null, (test) => {
  test.withApi('/hubs/marketing/accounts').should.supportPolling(accountPayload);
});
