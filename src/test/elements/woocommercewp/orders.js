'use strict';

const suite = require('core/suite');
const tools = require('core/tools');
const payload = require('./assets/orders');
const build = (overrides) => Object.assign({}, payload, overrides);
const ordersPayload = build({ payment_method_title: tools.random() });

suite.forElement('ecommerce', 'orders', { payload: ordersPayload }, (test) => {
  test.should.supportCruds();
  // unique is "id"
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'set_paid = \'true\'' } }).should.return200OnGet();
});
