'use strict';

const suite = require('core/suite');
const payload = require('./assets/customers');
const tools = require('core/tools');
payload.email = tools.randomEmail();

suite.forElement('ecommerce', 'customers', {payload: payload, skip: true}, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.supportCruds();
  test.should.supportCeqlSearch("email");
});
