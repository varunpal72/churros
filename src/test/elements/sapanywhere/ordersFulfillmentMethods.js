'use strict';

const suite = require('core/suite');


suite.forElement('ecommerce', 'orders/fulfillment-methods', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'name = \'Self Pickup\'' } }).should.return200OnGet();
});
