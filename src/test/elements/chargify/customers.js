'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = tools.requirePayload(`${__dirname}/assets/customers.json`);

suite.forElement('payment', 'customers', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
