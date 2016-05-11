'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', { payload: {} }, (test) => {
  test.should.supportPagination();
  test.should.return200OnGet();
});
