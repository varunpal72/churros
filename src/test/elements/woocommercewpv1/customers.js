'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/customers');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ last_name: tools.random(), first_name: tools.random(), username: tools.random(), email: tools.randomEmail() });

suite.forElement('ecommerce', 'customers', { payload: customersPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'email = \'john.doe@gmail.com\'' } }).should.return200OnGet();
});
