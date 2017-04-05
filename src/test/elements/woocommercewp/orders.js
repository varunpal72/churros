'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  test.should.supportCruds();
  test.withOptions({ qs: { page: 1, pageSize: 1 } }).should.return200OnGet();
  test.withOptions({ qs: { where: 'set_paid = \'true\'' } }).should.return200OnGet();
});
