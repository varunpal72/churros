'use strict';

const suite = require('core/suite');
const tools = require('core/tools');

const payload = () => ({
  "first_name": tools.random(),
  "last_name": tools.random(),
  "email": tools.randomEmail()
});

suite.forElement('payment', 'customers', { payload: payload() }, (test) => {
  test.should.supportCruds();
  test.should.supportPagination();
});
