'use strict';

const suite = require('core/suite');

suite.forElement('ecommerce', 'orders/exception-reasons', null, (test) => {
  test.should.supportSr();
  test.should.supportPagination();
  test.withOptions({ qs: { where: 'description = \'Quality Issue\'' } }).should.return200OnGet();
});
