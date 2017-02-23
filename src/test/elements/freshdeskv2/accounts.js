'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/accounts');
payload.customer.name = tools.random();

suite.forElement('helpdesk', 'accounts', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
