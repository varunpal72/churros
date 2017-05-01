'use strict';

const suite = require('core/suite');
const tools = require('core/tools')
const accountPayload = require('./assets/accounts');
const contactPayload = tools.requirePayload(`${__dirname}/assets/contacts.json`);

suite.forElement('marketing', 'polling', (test) => {
  test.withApi('/hubs/marketing/accounts').should.supportPolling(accountPayload);
  test.withApi('/hubs/marketing/contacts').should.supportPolling(contactPayload);
});
