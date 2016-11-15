'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders/fulfillment-methods', {skip: true}, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Self Pickup\'' } }).should.return200OnGet();
});
