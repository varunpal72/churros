'use strict';

const suite = require('core/suite');
const payload = require('./assets/accounts');
const tools = require('core/tools');
payload.name = tools.random();
payload.domains = [tools.random(), tools.random()];

suite.forElement('helpdesk', 'accounts', { payload: payload, skip: true }, (test) => {
  test.should.supportCruds();
});
