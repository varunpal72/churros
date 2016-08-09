'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders', (test) => {
  test.should.return200OnGet();
  test.withApi(`/hubs/ecommerce/orders-items`).should.return200OnGet();
  test.should.supportPagination();
});
