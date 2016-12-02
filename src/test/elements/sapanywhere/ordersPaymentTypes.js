'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders/payment-types', {skip: true}, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Cash on Delivery\'' } }).should.return200OnGet();
});
