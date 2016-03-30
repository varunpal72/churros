'use strict';

const suite = require('core/suite');
const payload = require('./assets/orders');

suite.forElement('ecommerce', 'orders', { payload: payload }, (test) => {
  test.should.return200OnGet();
  test.should.supportPagination();
  test.should.supportSr();
});
