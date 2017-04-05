'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/discounts');
const build = (overrides) => Object.assign({}, payload, overrides);
const customersPayload = build({ code: tools.random() });

suite.forElement('ecommerce', 'discounts', { payload: customersPayload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'individual_use = \'true\'' } }).should.return200OnGet();
});
