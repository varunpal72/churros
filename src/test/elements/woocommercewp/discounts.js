'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/discounts');
const build = (overrides) => Object.assign({}, payload, overrides);
const discountsPayload = build({ code: tools.random() });

suite.forElement('ecommerce', 'discounts', { payload: discountsPayload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'individual_use = \'true\'' } }).should.return200OnGet();
});
